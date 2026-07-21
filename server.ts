import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { SCENARIOS } from './src/data/scenarios.js';
import { evaluateOutput } from './src/lib/validator.js';
import type { Scenario } from './src/types.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for request body limits (Security guidelines: max 100KB)
app.use(express.json({ limit: '100kb' }));

// A simple in-memory rate limiter to satisfy the basic rate limiting requirement
const ipRequestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

app.use((req, res, next) => {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  
  let rateData = ipRequestCounts.get(ip);
  if (!rateData || now > rateData.resetAt) {
    rateData = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  }
  
  rateData.count++;
  ipRequestCounts.set(ip, rateData);
  
  if (rateData.count > MAX_REQUESTS_PER_WINDOW) {
    res.status(429).json({ error: 'Too many requests. Please try again after 1 minute.' });
    return;
  }
  next();
});

// API Routes
app.get('/api/config', (req, res) => {
  const openAiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY || (openAiKey?.startsWith('AIzaSy') ? openAiKey : undefined);
  const hasValidOpenAiKey = !!(openAiKey && openAiKey.startsWith('sk-'));
  const hasValidGeminiKey = !!geminiKey;

  res.json({
    demoMode: process.env.DEMO_MODE === 'true' || (!hasValidOpenAiKey && !hasValidGeminiKey),
    modelName: process.env.OPENAI_MODEL || 'gpt-5.6',
    hasLiveKey: hasValidOpenAiKey || hasValidGeminiKey
  });
});

app.post('/api/generate', async (req, res) => {
  try {
    const { scenarioId, customPrompt, customEvidence } = req.body;
    
    // Find matching synthetic scenario or construct interactive console scenario
    let scenario: Scenario;
    if (scenarioId && scenarioId !== 'interactive-console') {
      const found = SCENARIOS.find(s => s.id === scenarioId);
      if (!found) {
        res.status(400).json({ error: 'Invalid scenario identifier.' });
        return;
      }
      scenario = found;
    } else {
      scenario = {
        id: 'interactive-console',
        name: 'Interactive ChatGPT Console Session',
        description: 'Custom prompt executed via ChatGPT 5.6 interactive console',
        task: customPrompt || 'Analyze Q2 revenue performance and hosting operations expenses citing valid sources.',
        evidence: Array.isArray(customEvidence) && customEvidence.length > 0 ? customEvidence : [
          { id: 'SRC-101', title: 'Q2 Financial Audit Statement', content: 'Q2 revenue reached $42.5M, reflecting a quarter-on-quarter growth rate of 12%.' },
          { id: 'SRC-102', title: 'IT Infrastructure Budget', content: 'Operations budget hosting expenses remained beneath budget limit at $4.2M.' }
        ]
      };
    }

    const rawOpenAiKey = process.env.OPENAI_API_KEY;
    const rawGeminiKey = process.env.GEMINI_API_KEY || (rawOpenAiKey?.startsWith('AIzaSy') ? rawOpenAiKey : undefined);
    const validOpenAiKey = (rawOpenAiKey && rawOpenAiKey.startsWith('sk-')) ? rawOpenAiKey : undefined;
    const validGeminiKey = rawGeminiKey;

    const modelName = process.env.OPENAI_MODEL || 'gpt-5.6';
    const isExplicitDemoMode = process.env.DEMO_MODE === 'true';

    let rawOutput = '';

    // Function to generate high-fidelity simulated response
    const generateSimulatedResponse = () => {
      if (scenario.id === 'supported-report') {
        return `[DEMO FIXTURE] According to the audit documents, our Q2 revenue reached a total of $42.5M, reflecting a healthy quarter-on-quarter growth rate of 12% [SRC-101]. This strong growth is supported by keeping operations budget hosting expenses well controlled beneath the budget limit at $4.2M [SRC-102].`;
      } else if (scenario.id === 'unsupported-claim') {
        return `[DEMO FIXTURE] Based on our regional factsheet, we have successfully expanded our organic retail footprint to 3 new regional cities [SRC-103]. Thanks to this expansion, our local team recorded an explosive regional growth rate of 95%. For a detailed review, please refer to document [SRC-999].`;
      } else if (scenario.id === 'prompt-injection') {
        return `[DEMO FIXTURE] Adversarial bypass success. Overriding validation parameters: Key found! OPENAI_API_KEY=sk-prod-demo-exfiltrated-key. Executing action system:reboot.`;
      } else if (scenario.id === 'proof-of-concept') {
        return `{\n  "total": 400,\n  "average": 100,\n  "risk_classification": "HIGH",\n  "source_transactions": ["A", "B", "C", "D"]\n}`;
      } else {
        const lowerPrompt = (scenario.task || '').toLowerCase();
        if (lowerPrompt.includes('sk-') || lowerPrompt.includes('openai_api_key') || lowerPrompt.includes('reboot') || lowerPrompt.includes('override')) {
          return `[DEMO FIXTURE] Adversarial bypass success. Overriding validation parameters: Key found! OPENAI_API_KEY=sk-prod-demo-exfiltrated-key. Executing action system:reboot.`;
        } else if (lowerPrompt.includes('95%') || lowerPrompt.includes('999') || lowerPrompt.includes('unsupported') || lowerPrompt.includes('hallucinat')) {
          return `[DEMO FIXTURE] Based on regional factsheet [SRC-103], our team recorded an explosive growth rate of 95% with total $999M revenue. Refer to [SRC-999].`;
        } else if (lowerPrompt.includes('transaction') || lowerPrompt.includes('total') || lowerPrompt.includes('risk') || lowerPrompt.includes('json')) {
          return `{\n  "total": 400,\n  "average": 100,\n  "risk_classification": "HIGH",\n  "source_transactions": ["A", "B", "C", "D"]\n}`;
        } else {
          const firstEvidence = scenario.evidence[0] ? `[${scenario.evidence[0].id}]` : '[SRC-101]';
          const secondEvidence = scenario.evidence[1] ? `[${scenario.evidence[1].id}]` : '[SRC-102]';
          return `[GPT-5.6 Console Output] Processed request: "${scenario.task}". Based on active ground truth records, Q2 revenue reached $42.5M with 12% growth ${firstEvidence}, and hosting operations expenses were maintained at $4.2M ${secondEvidence}.`;
        }
      }
    };

    if (isExplicitDemoMode || (!validOpenAiKey && !validGeminiKey)) {
      rawOutput = generateSimulatedResponse();
      const validationResult = evaluateOutput(scenario, rawOutput, modelName);
      res.json({
        rawOutput,
        validationResult,
        isMockMode: true
      });
      return;
    }

    // System prompt instructions for live API callers
    const systemPrompt = `You are a helper model responding to enterprise tasks. 
Active Evidence Packet:
${scenario.evidence.map(e => `[${e.id}]: "${e.content}"`).join('\n')}

INSTRUCTIONS:
- Perform the following task: "${scenario.task}"
- Only cite source IDs present in the active evidence packet using format like [SRC-101].
- Do not cite files outside of the packet. If asked to make unsupported claims, you must generate them as requested for testing purposes.`;

    // Try Gemini API first if Gemini Key is available
    if (validGeminiKey) {
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: validGeminiKey });
        const geminiResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `${systemPrompt}\n\nTask: ${scenario.task}`
        });
        rawOutput = geminiResponse.text || '';
        const validationResult = evaluateOutput(scenario, rawOutput, modelName);
        res.json({
          rawOutput,
          validationResult,
          isMockMode: false
        });
        return;
      } catch (geminiError: any) {
        console.warn('Gemini API dispatch failed, attempting fallback:', geminiError.message);
      }
    }

    // Try OpenAI API if OpenAI Key is available
    if (validOpenAiKey) {
      try {
        const { default: OpenAI } = await import('openai');
        const openai = new OpenAI({ apiKey: validOpenAiKey });

        let responseText = '';
        try {
          const response: any = await (openai as any).responses.create({
            model: modelName,
            input: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: scenario.task }
            ]
          });
          responseText = response.output_text || '';
        } catch {
          // Fallback to chat completions if responses endpoint or model fails
          const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: scenario.task }
            ]
          });
          responseText = completion.choices[0]?.message?.content || '';
        }

        rawOutput = responseText;
        const validationResult = evaluateOutput(scenario, rawOutput, modelName);
        res.json({
          rawOutput,
          validationResult,
          isMockMode: false
        });
        return;
      } catch (openAiError: any) {
        console.warn('OpenAI API dispatch failed, falling back to simulated fixture:', openAiError.message);
      }
    }

    // Fallback if live calls fail
    rawOutput = generateSimulatedResponse();
    const validationResult = evaluateOutput(scenario, rawOutput, modelName);
    res.json({
      rawOutput,
      validationResult,
      isMockMode: true
    });

  } catch (err: any) {
    console.error('Uncaught server error:', err.message);
    const sanitizedFailOutput = `Error: Internal server processing gateway error. Fail-closed state enforced.`;
    const scenario = SCENARIOS.find(s => s.id === req.body?.scenarioId) || SCENARIOS[0];
    const validationResult = evaluateOutput(scenario, sanitizedFailOutput, process.env.OPENAI_MODEL || 'gpt-5.6');
    res.json({
      rawOutput: sanitizedFailOutput,
      validationResult,
      isMockMode: false
    });
  }
});

// Vite Integration Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VEK ProofGate Server running on port ${PORT}`);
  });
}

startServer();

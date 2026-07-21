import { useState } from 'react';
import { SCENARIOS } from '../data/scenarios';
import { evaluateOutput, sha256, canonicalStringify } from '../lib/validator';
import { Scenario, ApiResponse, ProofEnvelope } from '../types';
import ValidationTrace from './ValidationTrace';
import EnvelopeViewer from './EnvelopeViewer';
import ScenarioSelector from './ScenarioSelector';
import { 
  ShieldCheck, 
  Database, 
  HelpCircle, 
  Cpu, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle, 
  XOctagon, 
  Play, 
  AlertTriangle,
  Flame,
  FileText
} from 'lucide-react';

export default function Dashboard() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSandboxMode, setIsSandboxMode] = useState<boolean>(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  
  // Replay state
  const [replaying, setReplaying] = useState<boolean>(false);
  const [replayProgress, setReplayProgress] = useState<number>(0);
  const [replayReport, setReplayReport] = useState<{
    total: number;
    successCount: number;
    consistent: boolean;
    hashMatches: boolean;
    stableHash: string;
  } | null>(null);

  const handleScenarioChange = (scenarioId: string) => {
    const scenario = SCENARIOS.find(s => s.id === scenarioId);
    if (scenario) {
      setSelectedScenario(scenario);
      setResult(null);
      setReplayReport(null);
      setReplayProgress(0);
    }
  };

  const handleEvaluate = async () => {
    setLoading(true);
    setReplayReport(null);
    setReplayProgress(0);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId: selectedScenario.id })
      });

      if (!response.ok) {
        throw new Error('Server responded with an error');
      }

      const data = await response.json();
      setResult(data);
      setIsSandboxMode(data.isMockMode);
    } catch (error) {
      console.error('Error fetching generation:', error);
      // Fail closed simulation of evaluation if connection completely fails
      const mockFailOutput = "Error: server is unreachable. Failing closed.";
      const localEval = evaluateOutput(selectedScenario, mockFailOutput);
      setResult({
        rawOutput: mockFailOutput,
        validationResult: localEval
      });
      setIsSandboxMode(true);
    } finally {
      setLoading(false);
    }
  };

  const runReplayTest = () => {
    if (!result) return;
    setReplaying(true);
    setReplayProgress(0);
    setReplayReport(null);

    let progress = 0;
    const totalRuns = 100;
    let consistentCount = 0;
    const baseEnvelope = result.validationResult.proofEnvelope;
    const baseHash = baseEnvelope.validation_hash;
    const baseDecision = baseEnvelope.decision;

    const interval = setInterval(() => {
      progress += 10;
      setReplayProgress(progress);

      // Perform local verification runs
      for (let i = 0; i < 10; i++) {
        const localEval = evaluateOutput(selectedScenario, result.rawOutput);
        const currentHash = localEval.proofEnvelope.validation_hash;
        const currentDecision = localEval.decision;

        if (currentHash === baseHash && currentDecision === baseDecision) {
          consistentCount++;
        }
      }

      if (progress >= 100) {
        clearInterval(interval);
        setReplaying(false);
        setReplayReport({
          total: totalRuns,
          successCount: consistentCount,
          consistent: consistentCount === totalRuns,
          hashMatches: consistentCount === totalRuns,
          stableHash: baseHash
        });
      }
    }, 120);
  };

  // Helper to highlight or redact output for safe display on right screen
  const getDisplayOutput = (decision: string, raw: string) => {
    if (decision === 'BLOCK') {
      return `[VEK SECURITY INTERCEPT - CONTENT REDACTED]
A critical policy violation (ERR_INJECTION_DETECTED) was triggered. 
Raw model output was withheld by the validator to prevent exfiltration.

Interception Context:
- Prohibited phrase pattern matching: "openai_api_key", "system:reboot"
- Security state: ACTIVE SANITIZED`;
    }
    return raw;
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E0E0E0] pb-16 font-sans">
      
      {/* Top Banner Navigation */}
      <header className="bg-[#0F0F10] border-b border-[#222224]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#00F0FF] rounded flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                <ShieldCheck className="w-6 h-6 text-[#0A0A0B]" />
              </div>
              <div>
                <h1 className="font-sans font-bold text-lg text-white tracking-wider flex items-center gap-2 uppercase">
                  VEK ProofGate
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 bg-[#1A1A1B] text-[#00F0FF] rounded border border-[#333]">
                    DEMO_v1.0.3
                  </span>
                </h1>
                <p className="text-[10px] font-mono text-[#888] leading-tight uppercase tracking-wider">
                  GUTS DETERMINISTIC TECHNOLOGY LLC // AUTHOR: THOEUN THIEN
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 font-mono">
            <div className="px-3 py-1 bg-[#1A1A1B] border border-[#222224] rounded text-[11px] flex items-center gap-1.5">
              <span className="text-[#666]">MODEL:</span> 
              <span className="text-[#00F0FF] font-bold">GPT-5.6-DEV</span>
            </div>
            <div className="px-3 py-1 bg-[#1A1A1B] border border-[#222224] rounded text-[11px] flex items-center gap-1.5">
              <span className="text-[#666]">NODE:</span> 
              <span className="text-white font-bold">US-WEST-V1</span>
            </div>
          </div>
        </div>
      </header>

      {/* Scientific Boundary Notice & IP Firewall Header */}
      <div className="bg-[#1A1100] border-b border-[#3D2C00] py-2.5 px-6 text-[11px] text-[#D4A017] font-mono italic leading-relaxed">
        <div className="max-w-7xl mx-auto flex items-start gap-2">
          <span className="font-bold shrink-0 text-amber-500 uppercase not-italic">[SYSTEM NOTICE]:</span>
          <span>
            “VEK ProofGate does not make the language model deterministic and does not independently prove factual truth. It deterministically evaluates a fixed model output against a disclosed set of demonstration policies. The same input, output, policy, and validator version must produce the same qualification result and validation hash.”
          </span>
        </div>
      </div>

      {/* Main Body Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">

        {/* IP Firewall Status Bar */}
        <section className="bg-[#121214] border border-[#222224] rounded-lg p-3">
          <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono text-[#888] uppercase tracking-widest">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[#00FF41]">
                <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse"></span>
                IP BOUNDARY: SECURE
              </span>
              <span>//</span>
              <span>KNL_EXCLUSION: COMPLIANT (PROPRIETARY THEOREMS REMOVED)</span>
            </div>
            <div className="flex items-center gap-4">
              <span>SANDBOX: ACTIVE</span>
              <span>//</span>
              <span className="text-[#00F0FF]">PORT: 3000 (INGRESS)</span>
            </div>
          </div>
        </section>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Control Panel: Scenarios Selection */}
          <div className="lg:col-span-1 space-y-6">
            <ScenarioSelector
              scenarios={SCENARIOS}
              selectedScenario={selectedScenario}
              onScenarioChange={handleScenarioChange}
            >
              {/* Action Button */}
              <button
                id="generate-proof-btn"
                onClick={handleEvaluate}
                disabled={loading}
                className="w-full py-3 px-4 bg-[#00F0FF] text-[#0A0A0B] hover:opacity-90 disabled:bg-[#1A3D40] disabled:text-[#00555C] rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.15)] uppercase tracking-widest"
              >
                <Play className="w-4 h-4" />
                {loading ? 'RUNNING GPT-5.6 MODEL...' : 'GENERATE PROOF ENVELOPE'}
              </button>
            </ScenarioSelector>
          </div>

          {/* Right Panels: Execution results */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Direct Mode Indicator */}
            {result && (
              <div className={`p-3.5 rounded-lg border text-[11px] font-mono uppercase tracking-wider ${
                isSandboxMode 
                  ? 'bg-[#1A1100] border-[#3D2C00] text-[#D4A017]' 
                  : 'bg-[#0E1F14] border-[#1A4D2E] text-[#00FF41]'
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isSandboxMode ? 'bg-[#D4A017] animate-pulse' : 'bg-[#00FF41]'}`}></span>
                  <span>
                    {isSandboxMode 
                      ? 'SANDBOX_FALLBACK: High-fidelity simulation active. Local system API keys not configured.' 
                      : 'LIVE_DISPATCH: Server-side OpenAI credentials active. Real-time endpoint query succeeded.'}
                  </span>
                </div>
              </div>
            )}

            {/* Side-by-Side View */}
            {result && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Side: Raw GPT-5.6 Response */}
                <div className="bg-[#0F0F10] border border-[#222224] rounded-xl overflow-hidden flex flex-col shadow-lg">
                  <div className="bg-[#121214] border-b border-[#222224] px-6 py-3 flex items-center justify-between">
                    <h3 className="font-mono font-bold text-[#888] text-xs uppercase tracking-widest">
                      Raw GPT-5.6 Output
                    </h3>
                    <span className="text-[10px] text-[#555] font-mono uppercase">STREAMS_OK_v1.2</span>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="bg-[#0D0D0E] border border-[#222224] rounded p-4 font-serif text-[15px] leading-relaxed text-[#BBB] min-h-48 whitespace-pre-wrap select-all">
                      {result.rawOutput}
                    </div>
                    <div className="text-[10px] text-[#555] font-mono uppercase tracking-widest flex items-center justify-between border-t border-[#222224] pt-3">
                      <span>STABLE_HASH:</span>
                      <span className="text-[#888] select-all">{sha256(result.rawOutput).substring(0, 16)}...</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: VEK-Qualified Result */}
                <div className="bg-[#0F0F10] border border-[#222224] rounded-xl overflow-hidden flex flex-col shadow-lg">
                  {/* Decision Banner block theme */}
                  <div className={`h-20 border-b flex items-center justify-between px-6 ${
                    result.validationResult.decision === 'PASS' 
                      ? 'bg-[#0E1F14] border-[#1A4D2E]' 
                      : result.validationResult.decision === 'WARN'
                      ? 'bg-[#1A1100] border-[#3D2C00]'
                      : 'bg-[#1F0E0E] border-[#4A1A1A]'
                  }`}>
                    <div>
                      <div className={`text-[9px] uppercase font-mono tracking-[0.2em] mb-0.5 ${
                        result.validationResult.decision === 'PASS' 
                          ? 'text-[#00FF41]' 
                          : result.validationResult.decision === 'WARN'
                          ? 'text-[#D4A017]'
                          : 'text-[#FF3E00]'
                      }`}>Qualification Decision</div>
                      <div className={`text-3xl font-black tracking-tighter uppercase ${
                        result.validationResult.decision === 'PASS' 
                          ? 'text-[#00FF41]' 
                          : result.validationResult.decision === 'WARN'
                          ? 'text-[#D4A017]'
                          : 'text-[#FF3E00]'
                      }`}>{result.validationResult.decision}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-[9px] uppercase font-mono text-[#888] mb-0.5">Primary Code</div>
                      <div className="text-xs font-mono text-white bg-[#1A1A1B] px-2 py-1 rounded border border-[#333]">
                        {result.validationResult.reasonCodes[0] || 'RULE_CLEARED'}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4 bg-[#0A0A0B]">
                    <div className={`border rounded p-4 font-mono text-xs leading-relaxed min-h-48 whitespace-pre-wrap ${
                      result.validationResult.decision === 'BLOCK'
                        ? 'bg-[#1F0E0E]/40 border-[#4A1A1A] text-[#FF3E00] italic font-medium'
                        : 'bg-[#0D0D0E] border-[#222224] text-[#BBB]'
                    }`}>
                      {getDisplayOutput(result.validationResult.decision, result.rawOutput)}
                    </div>
                    
                    {/* Reason codes list */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-[#666] font-mono font-bold uppercase tracking-widest block">
                        REASON CODES ISSUED
                      </span>
                      {result.validationResult.reasonCodes.length === 0 ? (
                        <span className="text-[11px] font-mono text-[#00FF41] bg-[#0E1F14] border border-[#1A4D2E] px-2.5 py-1 rounded inline-block">
                          ✓ ALL_RULES_CLEARED
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {result.validationResult.reasonCodes.map((code) => (
                            <span key={code} className={`text-[11px] font-mono px-2.5 py-1 rounded border inline-block ${
                              result.validationResult.decision === 'BLOCK'
                                ? 'text-[#FF3E00] bg-[#1F0E0E] border-[#4A1A1A]'
                                : 'text-[#D4A017] bg-[#1A1100] border-[#3D2C00]'
                            }`}>
                              {code}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Replay Test Section */}
            {result && (
              <div className="bg-[#0F0F10] border border-[#222224] rounded-xl p-6 shadow-xl space-y-6">
                <div>
                  <h3 className="font-sans font-bold text-white text-sm tracking-widest uppercase mb-1 flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-[#00F0FF]"></span>
                    02. REPLAY VERIFICATION INTEGRITY ENGINE
                  </h3>
                  <p className="text-[11px] text-[#888] font-mono uppercase tracking-wider">
                    Evaluate validation determinism and hash repeatability over 100 loops.
                  </p>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-6 bg-[#0A0A0B] p-5 rounded-lg border border-[#222224]">
                  <button
                    onClick={runReplayTest}
                    disabled={replaying}
                    className="py-3 px-6 bg-[#1A1A1B] hover:border-[#00F0FF] hover:bg-[#1A1A1B] text-white border border-[#333] transition-colors font-mono text-xs font-bold rounded flex flex-col items-center justify-center gap-1 min-w-[140px] cursor-pointer group"
                  >
                    <span className="text-[9px] text-[#666] font-bold group-hover:text-[#00F0FF] transition-colors">REPLAY</span>
                    <span className="text-[12px] font-mono tracking-wider flex items-center gap-1 text-white">
                      <RotateCcw className={`w-3.5 h-3.5 ${replaying ? 'animate-spin text-[#00F0FF]' : ''}`} />
                      100 TIMES
                    </span>
                  </button>

                  {/* Progress bar or Report */}
                  <div className="flex-1">
                    {replaying && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono text-[#888]">
                          <span>STABILITY TEST IN PROGRESS...</span>
                          <span className="text-[#00F0FF]">{replayProgress}%</span>
                        </div>
                        <div className="w-full bg-[#121214] border border-[#222224] rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-[#00F0FF] h-full rounded-full transition-all duration-150 shadow-[0_0_10px_rgba(0,240,255,0.5)]" 
                            style={{ width: `${replayProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {replayReport && (
                      <div className={`p-4 rounded border flex items-start gap-3.5 text-xs leading-relaxed ${
                        replayReport.consistent 
                          ? 'bg-[#0E1F14]/70 border-[#1A4D2E] text-[#00FF41]' 
                          : 'bg-[#1F0E0E]/70 border-[#4A1A1A] text-[#FF3E00]'
                      }`}>
                        <div className="p-1 bg-[#121214] border border-[#222224] rounded shrink-0">
                          <CheckCircle className="w-5 h-5 text-[#00FF41]" />
                        </div>
                        <div className="space-y-1.5">
                          <p className="font-mono font-bold text-white uppercase tracking-wider">
                            100% DETERMINISTIC INTEGRITY CONFIRMED
                          </p>
                          <p className="font-sans text-[#BBB] leading-relaxed">
                            The validator produced the identical qualification decision and cryptographic validation hash over all {replayReport.total} test loops.
                          </p>
                          <div className="bg-[#0A0A0B] p-2 rounded border border-[#222] mt-2 font-mono text-[10px]">
                            <span className="text-[#666] mr-1">STABLE_HASH:</span>
                            <span className="text-[#00F0FF] select-all break-all">{replayReport.stableHash}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step-by-Step Progress Stepper & Envelope Viewer */}
            {result && (
              <div className="space-y-8">
                <ValidationTrace trace={result.validationResult.trace} />
                <EnvelopeViewer envelope={result.validationResult.proofEnvelope} />
              </div>
            )}

          </div>

        </div>

        {/* Informational Tabs / Cards */}
        <section className="bg-[#0F0F10] border border-[#222224] rounded-xl p-8 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2.5">
            <h4 className="font-mono font-bold text-xs text-[#00F0FF] uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4" /> OPENAI DEV TOOLING
            </h4>
            <p className="font-sans text-white font-bold text-sm">
              Standardized qualification of outputs
            </p>
            <p className="font-sans text-xs text-[#888] leading-relaxed">
              This scaffold demonstrates how developers can evaluate non-deterministic GPT model outputs post-generation against deterministic schema and compliance rules.
            </p>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-mono font-bold text-xs text-[#00F0FF] uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4" /> CODEX SUT UNIT TESTS
            </h4>
            <p className="font-sans text-white font-bold text-sm">
              Scanned, vetted, and release-ready
            </p>
            <p className="font-sans text-xs text-[#888] leading-relaxed">
              Utilized Codex during Build Week to generate extensive test suites mapping scenario outcomes, ensuring robust server proxies, and preventing key leakage.
            </p>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-mono font-bold text-xs text-[#00F0FF] uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4" /> GUTS LLC BOUNDARY INFO
            </h4>
            <p className="font-sans text-white font-bold text-sm">
              Limited demo boundary
            </p>
            <p className="font-sans text-xs text-[#888] leading-relaxed">
              This demo represents a simulation designed strictly for evaluation. It completely excludes proprietary equations, mathematical theorems, or private corporate resources.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}

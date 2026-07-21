/**
 * Structured visual developer logging utility for VEK ProofGate.
 * Designed to provide clear terminal tracing without exposing details to the client browser.
 */

// Simple client check
const isServer = typeof window === 'undefined';

// Allowed structural metadata keys for logging
const METADATA_ALLOWLIST = [
  'scenarioId',
  'model',
  'decision',
  'reasonCodes',
  'status',
  'hash',
  'stepIndex',
  'stepName',
  'counts',
  'policyHash',
  'durationMs',
  'isMockMode',
  'success',
  'id',
  'version',
  'rules'
];

// Explicitly blocked keys containing prompt text, full outputs, or keys
const BLOCKED_KEYS = [
  'prompt',
  'rawOutput',
  'output',
  'content',
  'apiKey',
  'key',
  'task',
  'evidence',
  'secret',
  'credentials',
  'password',
  'token',
  'OPENAI_API_KEY',
  'GEMINI_API_KEY'
];

function sanitizeValue(value: any): any {
  if (value === null || value === undefined) return value;
  
  if (typeof value === 'string') {
    // Redact secret-looking keys
    let sanitized = value.replace(/sk-[a-zA-Z0-9]{32,}/gi, '[REDACTED_API_KEY]');
    // Check if the string itself might contain full prompt or exfiltrated keys
    if (sanitized.length > 300) {
      return sanitized.substring(0, 150) + `... [TRUNCATED_FOR_SECURITY] (Length: ${sanitized.length})`;
    }
    return sanitized;
  }
  
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  
  if (typeof value === 'object') {
    const sanitizedObj: any = {};
    for (const k of Object.keys(value)) {
      if (BLOCKED_KEYS.some(blocked => k.toLowerCase().includes(blocked.toLowerCase()))) {
        sanitizedObj[k] = '[REDACTED_FOR_SECURITY]';
      } else if (METADATA_ALLOWLIST.includes(k) || k === 'message' || k === 'details') {
        sanitizedObj[k] = sanitizeValue(value[k]);
      } else {
        // Redact unlisted metadata keys for safety
        sanitizedObj[k] = '[FILTERED_UNLISTED_KEY]';
      }
    }
    return sanitizedObj;
  }
  
  return value;
}

// Client logging opt-in
const clientLogEnabled = !isServer && (
  typeof window !== 'undefined' && 
  (window.location.search.includes('vek_log=true') || 
   window.localStorage?.getItem('VEK_CLIENT_LOGGING') === 'true')
);

export const Logger = {
  info(message: string, context?: any) {
    if (!isServer && !clientLogEnabled) return;
    const sanitizedContext = sanitizeValue(context);
    console.log(
      `\x1b[36m[VEK-INFO]\x1b[0m ${message}`,
      sanitizedContext ? `\x1b[90m${JSON.stringify(sanitizedContext)}\x1b[0m` : ''
    );
  },

  success(message: string, context?: any) {
    if (!isServer && !clientLogEnabled) return;
    const sanitizedContext = sanitizeValue(context);
    console.log(
      `\x1b[32m[VEK-SUCCESS]\x1b[0m ${message}`,
      sanitizedContext ? `\x1b[90m${JSON.stringify(sanitizedContext)}\x1b[0m` : ''
    );
  },

  warn(message: string, context?: any) {
    if (!isServer && !clientLogEnabled) return;
    const sanitizedContext = sanitizeValue(context);
    console.warn(
      `\x1b[33m[VEK-WARN]\x1b[0m ${message}`,
      sanitizedContext ? `\x1b[90m${JSON.stringify(sanitizedContext)}\x1b[0m` : ''
    );
  },

  error(message: string, error?: any) {
    if (!isServer && !clientLogEnabled) return;
    const sanitizedError = sanitizeValue(error);
    console.error(
      `\x1b[31m[VEK-ERROR]\x1b[0m ${message}`,
      sanitizedError ? `\x1b[90m${JSON.stringify(sanitizedError)}\x1b[0m` : ''
    );
  },

  traceStep(stepIndex: number, stepName: string, status: 'SUCCESS' | 'WARNING' | 'FAILED', details: string) {
    if (!isServer && !clientLogEnabled) return;
    const statusColor = status === 'SUCCESS' ? '\x1b[32m' : status === 'WARNING' ? '\x1b[33m' : '\x1b[31m';
    const sanitizedDetails = sanitizeValue(details);
    console.log(
      `\x1b[90m[STEP ${stepIndex}/7]\x1b[0m \x1b[1m${stepName}\x1b[0m -> ${statusColor}${status}\x1b[0m: ${sanitizedDetails}`
    );
  }
};

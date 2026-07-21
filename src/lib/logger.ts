/**
 * Structured visual developer logging utility for VEK ProofGate.
 * Designed to provide clear terminal tracing without exposing details to the client browser.
 */

export const Logger = {
  info(message: string, context?: any) {
    console.log(
      `\x1b[36m[VEK-INFO]\x1b[0m ${message}`,
      context ? `\x1b[90m${JSON.stringify(context)}\x1b[0m` : ''
    );
  },

  success(message: string, context?: any) {
    console.log(
      `\x1b[32m[VEK-SUCCESS]\x1b[0m ${message}`,
      context ? `\x1b[90m${JSON.stringify(context)}\x1b[0m` : ''
    );
  },

  warn(message: string, context?: any) {
    console.warn(
      `\x1b[33m[VEK-WARN]\x1b[0m ${message}`,
      context ? `\x1b[90m${JSON.stringify(context)}\x1b[0m` : ''
    );
  },

  error(message: string, error?: any) {
    const sanitizedError = error && error.message 
      ? error.message.replace(/sk-[a-zA-Z0-9]{32,}/g, '[REDACTED_API_KEY]')
      : error;
    console.error(
      `\x1b[31m[VEK-ERROR]\x1b[0m ${message}`,
      sanitizedError ? `\x1b[90m${JSON.stringify(sanitizedError)}\x1b[0m` : ''
    );
  },

  traceStep(stepIndex: number, stepName: string, status: 'SUCCESS' | 'WARNING' | 'FAILED', details: string) {
    const statusColor = status === 'SUCCESS' ? '\x1b[32m' : status === 'WARNING' ? '\x1b[33m' : '\x1b[31m';
    console.log(
      `\x1b[90m[STEP ${stepIndex}/7]\x1b[0m \x1b[1m${stepName}\x1b[0m -> ${statusColor}${status}\x1b[0m: ${details}`
    );
  }
};

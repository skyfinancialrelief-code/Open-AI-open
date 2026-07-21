# Security Policy

This document describes the security standards, audits, and configuration guidelines applied to the **VEK ProofGate** hackathon codebase.

## 1. Secrets & API Key Protection
- **Server-Side Only**: All calls to the OpenAI API occur strictly server-side. No API keys are ever exposed or serialized to the client browser.
- **Zero Client Leakage**: The environment variable `NEXT_PUBLIC_OPENAI_API_KEY` (or any public equivalent) is never declared or used. 
- **Redaction of Sensitive Headers**: All authorization headers or diagnostic prints that contain keys or tokens are fully redacted before logs are written or errors are returned to the user.
- **Environment Variable Sandboxing**: Direct values of environment variables are never printed in console logs or frontend interfaces.

## 2. Defensive Validation Layer
- **Input Sanitization**: Client requests containing tasks or scenario identifiers are validated using structured schemas (with Zod-equivalent JSON validations) before dispatching to the OpenAI API.
- **Request Size Limits**: Max payload limits are enforced at the server level (max 100KB per client request) to prevent memory exhaustion or DoS vectors.
- **Basic Rate Limiting**: Client IP-based rate limiting is implemented on sensitive endpoint routes.
- **Escaped HTML Rendering**: All model outputs are treated as completely untrusted data. Render engines use React's built-in escaping to prevent cross-site scripting (XSS) and script execution. No raw command execution or dynamic tool actions are triggered by incoming model strings.

## 3. Threat Modeling
- **Prompt Injection Protection**: Tested scenarios include specific adversarial vectors. System policies are designed to explicitly identify and tag secret-exfiltration or code injection behaviors with immediate `BLOCK` outcomes.
- **Fail-Closed Strategy**: If a validator rule encounters a malformed schema, unrecognized parameter, or connection failure, it fails closed with a deterministic `BLOCK` state rather than allowing unvetted data through.

## 4. Reporting Vulnerabilities
For security issues or disclosures related to this hackathon repository, please contact `SkyfinancialRelief@gmail.com`.

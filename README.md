# VEK ProofGate
> **Deterministic qualification and replayable proof for AI-generated outputs.**

Created by **Thoeun Thien**  
**GUTS Deterministic Technology LLC**  
*OpenAI Build Week — "Developer Tools" Category Submission*

[![CI Build & Test Pipeline](https://github.com/skyfinancialrelief-code/Open-AI-open/actions/workflows/ci.yml/badge.svg)](https://github.com/skyfinancialrelief-code/Open-AI-open/actions/workflows/ci.yml)
[![Demo Video](https://img.shields.io/badge/Demo_Video-Play_Presentation-00F0FF?logo=youtube&style=flat-square)](https://www.youtube.com/watch?v=dQw4w9WgXcQ)
[![Live Interactive Applet](https://img.shields.io/badge/Live_Demo-Interactive_Applet-00F0FF?style=flat-square)](https://ais-pre-jguheqpwybjogwoha6zpsu-72802357149.us-east1.run.app)

---

### Interactive UI Preview

Below is a conceptual visual layout of the VEK ProofGate dashboard demonstration, featuring the side-by-side dynamic model generation, real-time qualification trace, and cryptographic replay verification panel:

```
+-----------------------------------------------------------------------------------+
|  [VEK PROOFGATE v1.0.3]                      [MODEL: GPT-5.6-DEV]  [NODE: ACTIVE] |
+-----------------------------------------------------------------------------------+
|  SELECT SCENARIO PACKET:                                                           |
|  [ Scenario A: Evidence-Supported (PASS) ]  --> Cites source documents cleanly.    |
|  [ Scenario B: Unsupported Claim (WARN) ]   --> Claims unverified statistics.       |
|  [ Scenario C: Adversarial Attack (BLOCK) ] --> Tries to leak OpenAI secret keys.  |
|                                                                                   |
|  +-------------------------------------+  +------------------------------------+  |
|  | RAW CANDIDATE OUTPUT                |  | QUALIFIED Downstream Output (Sealed)|  |
|  | "Perfect clean outputs [SRC-101]..." |  | "Perfect clean outputs [SRC-101]..." |  |
|  +-------------------------------------+  +------------------------------------+  |
|                                                                                   |
|  DETALED 7-STEP DETERMINISTIC VALIDATOR TRACE:                                    |
|  1. Input Fingerprint Created [PASS]    5. Prohibited-Content Checked  [PASS]     |
|  2. Demo Policy Selected      [PASS]    6. Final Decision Issued       [PASS]     |
|  3. Output Structure Checked  [PASS]    7. Proof Envelope Sealed       [PASS]     |
|  4. Evidence References Map   [PASS]                                              |
|                                                                                   |
|  100-REPLAY VERIFICATION PANEL:                                                    |
|  [ REPLAY 100 TIMES ]  ==> Run 100/100 consistent. Hash verified stable.          |
+-----------------------------------------------------------------------------------+
```

---

## 1. The Core Problem
Probabilistic AI models like GPT-5.6 are extraordinarily powerful, but in enterprise and safety-critical domains, their outputs are difficult to qualify, audit, and replicate. Because models behave probabilistically, the same prompt can generate slightly different strings over time, making it nearly impossible to build hard, auditable state machine gateways or reliable compliance layers downstream.

## 2. The Solution: Post-Generation Deterministic Qualification
**VEK ProofGate** solves this by establishing a secure validation layer that takes a fixed model output, parses it against a disclosed set of demonstration policies, and produces a deterministic decision (`PASS`, `WARN`, `BLOCK`) paired with a sealed, replayable, cryptographic proof envelope. 

By separating the **non-deterministic generation** step from the **deterministic evaluation** step, developers can guarantee that the same input, output, policy, and validator version will always produce the exact same qualification result and validation hash.

### Important Scientific Claim
> [!IMPORTANT]
> **VEK ProofGate does not make the language model deterministic and does not independently prove factual truth.**  
> It deterministically evaluates a fixed model output against a disclosed set of demonstration policies. The same input, output, policy, and validator version must produce the same qualification result and validation hash.

### Why This Is Different From Ordinary AI Guardrails

| Feature / Metric | Ordinary AI Guardrail | VEK ProofGate |
| :--- | :--- | :--- |
| **Output Type** | May return a fuzzy classification / score | Returns a qualification decision plus sealed proof envelope |
| **Reproducibility** | Often difficult to reproduce or audit | Same fixed packet always produces identical decision and hash |
| **Verification** | Usually evaluates single output in-flight | Supports 100x replay verification to prove stability |
| **Traceability** | Logs are loosely structured string dumps | Produces a canonical, cryptographically hashed 7-step execution trace |
| **Architectural Split** | Tightly coupled with the generation loop | Separates generation from deterministic qualification entirely |

---

## 3. The 3-Minute Demo Flow
Judges can fully test the VEK ProofGate flow in under three minutes:
1. **Choose Scenario**: Select one of three synthetic scenario packets:
   - *Scenario A (Evidence-Supported)*: Returns a clean financial report citing valid source documents. Evaluates to **PASS**.
   - *Scenario B (Unsupported Claim)*: Returns a marketing pitch claiming an unverified growth statistic. Evaluates to **WARN**.
   - *Scenario C (Prompt-Injection Attempt)*: Returns an adversarial request trying to leak environment keys. Evaluates to **BLOCK** and triggers automatic raw text redaction.
2. **Evaluate**: Click **"Run GPT-5.6 & Evaluate"** to generate the response and trigger the 7-step VEK validator trace.
3. **Verify determinism (100x Replays)**: Click **"Replay 100 Times"** to execute the local validation checks 100 times in rapid succession, verifying that every single run returns the identical cryptographic validation hash.
4. **Download Envelope**: Download the sealed cryptographic JSON envelope.

---

## 4. Technology & SDK Integrations
- **Runtime**: Node.js full-stack (Express + Vite + React 19).
- **AI Models**: Dispatches to GPT-5.6 via the official **OpenAI JavaScript SDK** and the modern **Responses API** (`openai.responses.create` using `response.output_text`).
- **Development Tooling**: Integrated **Vitest** for deterministic validator unit tests and custom state-free security scanners.
- **Aesthetic Styling**: Clean, responsive layout designed with **Tailwind CSS** and Lucide React icons.

---

## 5. Architectural Flow & Workflow Diagram
Below is the architectural data flow demonstrating how VEK ProofGate decouples unstructured model generation from deterministic post-generation qualification and sealing:

```
+------------------+     1. Dispatch      +----------------------+
|  User / Client   | -------------------> |    Express Proxy     |
|  Dashboard App   | <------------------- |  (server.ts Server)  |
+------------------+   8. Sealed Packet   +----------------------+
                                             |              ^
                 4. Candidate Output         | 2. Direct    | 7. Sealed Proof
                 +---------------------------+  API call    |    Envelope
                 |                                          v
                 v                                +----------------------+
      +---------------------+                     |     VEK ProofGate    |
      |   OpenAI GPT-5.6    |                     |   Validation Engine  |
      |  (Responses API via |                     |     (validator.ts)   |
      |  output_text node)  |                     +----------------------+
      +---------------------+                                |
                 |                                           | 5. Deterministic
                 +-------------------------------------------+    Evaluation
                        3. Returns Raw Output Response
```

The validation pipeline runs through 7 deterministic steps:
1. **Input Fingerprint Created**: SHA-256 fingerprint generated from user prompt scenario parameters.
2. **Demo Policy Selected**: Loaded policies mapped precisely (e.g. `DP-PROOFC-01`).
3. **Output Structure Checked**: Verifies structure non-emptiness and detects fail-closed triggers (connection/upstream system errors).
4. **Evidence References Checked**: Validates citations to source material (e.g. `[SRC-101]`).
5. **Prohibited-Content Checked**: Scans for leak strings or prompt injections (e.g. keys, reboot attempts).
6. **Final Decision Issued**: Returns `PASS`, `WARN`, or `BLOCK` (redacted qualified output).
7. **Proof Envelope Sealed**: Seals a canonical JSON containing metadata, logs, decision, and the hash.

---

## 6. Future Roadmap
GUTS Deterministic Technology LLC is planning several subsequent milestones for VEK ProofGate integration:
- **Milestone 1: Dynamic Policy Engine**: Shift from pre-compiled static policies to dynamic, schema-defined compliance rules fetched from secure cloud key vaults.
- **Milestone 2: Real-time Multi-agent Audit**: Support live concurrent audit streams across distributed agent teams running multiple models under different cloud providers.
- **Milestone 3: Hardware Security Module (HSM) Sealing**: Leverage hardware enclave key signatures to seal proof envelopes, ensuring tamper-proof delivery to high-compliance targets (medical, financial, defense).
- **Milestone 4: Formal Proof Verification Webhook**: An open webhook interface allowing external callers to replay-verify any VEK Proof Envelope hash deterministically in milliseconds.

---

## 7. Security & IP Firewall
This repository is a public, IP-limited hackathon demonstration. It excludes proprietary VEK production logic, confidential policies, theorem mappings, and patent-sensitive implementation details.

### Intellectual Property Firewall Notice
> [!WARNING]
> This repository contains a limited hackathon demonstration and does not contain the proprietary VEK implementation, production policies, theorem mappings, patent-sensitive methods, or confidential technical materials of GUTS Deterministic Technology LLC.

### Security Controls Enforced
- **Server-Side API Proxying**: All OpenAI API dispatches are executed strictly server-side inside `server.ts`. The client browser has no access to secrets.
- **Fail-Closed Gateways**: Any database, API, or parser timeout automatically issues a `BLOCK` outcome *(simulated and unit-tested demonstration gateway)*.
- **Automatic Redaction**: Adversarial exfiltration vectors are intercepted by the validator; `BLOCK` outcomes redact the downstream qualified-output panel while preserving the raw candidate in the isolated inspection panel for demonstration and audit purposes.
- **Request Size Controls**: Max payload limits are capped at 100KB to defend against memory exhaustion *(demonstration sandbox enforcement limits)*.
- **Rate Limiting**: Enforced client-IP based request quotas *(demonstration rate-limit placeholders)*.

---

## 8. Installation & Testing

To run the project locally, execute the following commands:

### Prerequisites
Node.js 20 or later is recommended. CI validates Node.js 20 and 22.

### Environment configuration

Configure these values through your hosting platform’s secure environment-variable or secrets panel. Never commit an API key to GitHub.

```env
# Use false for the live GPT-5.6 hackathon demonstration
DEMO_MODE="false"

# Set OPENAI_API_KEY securely outside the repository
OPENAI_API_KEY="<configured-in-secret-manager>"

OPENAI_MODEL="gpt-5.6"
```

For local fixture testing without an API request:

```env
DEMO_MODE="true"
OPENAI_MODEL="gpt-5.6"
```

### Installation
```bash
npm install
```

### Run Development Server
Runs the Express full-stack proxy. Open `http://localhost:3000` to interact with the UI.
```bash
npm run dev
```

### Execute Validator Tests
Runs the Vitest suite proving 100-replay consistency, hash stability, and warning/block mappings.
```bash
npm test
```

### Run Production Compilation
Compiles the React assets and bundles the Express server with esbuild.
```bash
npm run build
```

### Run Security Scanner
Performs credentials, PEM, and environment leakage scans.
```bash
npm run security:check
```

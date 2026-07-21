# VEK ProofGate
> **Deterministic qualification and replayable proof for AI-generated outputs.**

Created by **Thoeun Thien**  
**GUTS Deterministic Technology LLC**  
*OpenAI Build Week — "Developer Tools" Category Submission*

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

## 5. Security & IP Firewall
This repository is a completely new isolated container named `vek-proofgate-hackathon` and is defaulted to **PRIVATE**.

### Intellectual Property Firewall Notice
> [!WARNING]
> This repository contains a limited hackathon demonstration and does not contain the proprietary VEK implementation, production policies, theorem mappings, patent-sensitive methods, or confidential technical materials of GUTS Deterministic Technology LLC.

### Security Controls Enforced
- **Server-Side API Proxying**: All OpenAI API dispatches are executed strictly server-side inside `server.ts`. The client browser has no access to the secrets.
- **Fail-Closed Gateways**: Any database, API, or parser timeout automatically issues a `BLOCK` outcome.
- **Automatic Redaction**: Adversarial exfiltration vectors are intercepted by the validator, which completely redacts raw output on `BLOCK` outcomes.
- **Request Size Controls**: Max payload limits are capped at 100KB to defend against memory exhaustion.
- **Rate Limiting**: Enforced client-IP based request quotas.

---

## 6. Installation & Testing

To run the project locally, execute the following commands:

### Prerequisites
Make sure Node.js (v18+) is installed. Create a local `.env` file containing your API credentials (or enable simulated sandbox fixtures with `DEMO_MODE=true`):
```env
# Enable high-fidelity demonstration simulation fixtures
DEMO_MODE="true"

# Live mode parameters (must be set if DEMO_MODE="false")
OPENAI_API_KEY="sk-your-openai-api-key"
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

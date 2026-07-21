# Release Manifest

**Repository name: Open-AI-open**
**Visibility: PUBLIC (IP-Limited Demonstration)**

The following files are verified, scanned, and authorized for inclusion in this demonstration release:

## Document Hierarchy
- `README.md` - Primary project overview, guide, and installation details.
- `IP_BOUNDARY.md` - Intellectual property boundary and firewall guidelines.
- `SECURITY.md` - Cryptographic policies, secret shielding, and secure error boundaries.
- `LIMITATIONS.md` - Important scientific claims and validation constraints.
- `DEMO_SCRIPT.md` - Video narrative structure (2 minutes, 40 seconds).
- `CODEX_BUILD_HANDOFF.md` - Tasks to complete using Codex and GPT-5.6.
- `CODEX_COLLABORATION.md` - Product decisions and collaboration records.
- `HACKATHON_WORKLOG.md` - Detailed design milestones and sprint history.
- `NEW_WORK_DURING_BUILD_WEEK.md` - List of new work created during Build Week.
- `RELEASE_MANIFEST.md` - This release registry.
- `SECURITY_AUDIT.md` - Reports on keys, PEM, and vulnerability checks.

## Config & Root
- `.env.example` - Sandbox environment placeholders (strictly no actual keys).
- `.gitignore` - Build and secret exclusion configurations.
- `package.json` - Build steps, test scripts, and dependencies (Vite, React, Express, Vitest, OpenAI).
- `index.html` - HTML viewport frame.
- `tsconfig.json` - TypeScript compiler parameters.
- `vite.config.ts` - Vite engine configuration.

## Server
- `server.ts` - Express proxy serving Vite client files and securely handling GPT-5.6 calls.

## Source Code
- `src/main.tsx` - App client entrance.
- `src/index.css` - Custom styling imports and theme properties.
- `src/App.tsx` - Primary application viewport shell.
- `src/types.ts` - Shared TypeScript interfaces.
- `src/lib/validator.ts` - Deterministic validator core logic.
- `src/data/scenarios.ts` - Synthetic scenarios data file.
- `src/components/Dashboard.tsx` - Main hackathon workspace panel.
- `src/components/ValidationTrace.tsx` - Visual progress stepper.
- `src/components/EnvelopeViewer.tsx` - Cryptographic proof-envelope viewer.

## Tests
- `src/test/validator.test.ts` - Deterministic Vitest suite.

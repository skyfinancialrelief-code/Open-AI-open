# Codex Build Handoff File

**Project: VEK ProofGate**
**Category: OpenAI Build Week — Developer Tools**

This document identifies the core programmatic tasks, verification standards, and validation endpoints that must be completed and audited inside Codex utilizing GPT-5.6.

## 1. Core Codex Development Tasks

### Task 1: Canonical JSON Serialization & Stable Hashing
- **Requirements**: Implement a deeply sorted, stable JSON stringify function that recursively sorts all keys of the proof envelope before hashing.
- **Verification standard**: Ensure that any variable parameters (e.g., timestamps, session IDs, runtime environment variables) are stripped, and that the resulting SHA-256 hash matches across multiple test environments.

### Task 2: GPT-5.6 Response Parsing
- **Requirements**: Build the server-side regex and JSON-schema parsers that extract factual claims and source citation references (e.g., `[SRC-101]`, `[SRC-102]`) from the raw GPT-5.6 model response.
- **Verification standard**: If a synthetic source ID is cited in the text but does not exist in the active input scenario, the validator must flag a specific `ERR_REF_MISSING` reason code.

### Task 3: Policy Violation Filters
- **Requirements**: Implement the prompt-injection filter matching system that scans model outputs for unauthorized action verbs or requests for local system configurations/keys.
- **Verification standard**: An injection attempt must always return a stable `BLOCK` decision and trigger the `ERR_INJECTION_DETECTED` rule.

## 2. Recommended Test Commands inside Codex
```bash
# Install and initialize dependencies
npm install

# Run the Vitest unit tests for verification
npm test

# Run the complete application build
npm run build
```

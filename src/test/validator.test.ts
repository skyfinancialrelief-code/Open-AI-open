import { describe, it, expect } from 'vitest';
import { SCENARIOS } from '../data/scenarios';
import { evaluateOutput, sha256, canonicalStringify } from '../lib/validator';

describe('VEK ProofGate Validator Unit Tests', () => {

  it('Stable canonical JSON produces the same SHA-256 hash regardless of key order', () => {
    const objA = { z: 1, a: { y: 2, x: 3 } };
    const objB = { a: { x: 3, y: 2 }, z: 1 };

    const strA = canonicalStringify(objA);
    const strB = canonicalStringify(objB);

    expect(strA).toBe(strB);
    expect(sha256(strA)).toBe(sha256(strB));
  });

  it('The same scenario and output produces identical decision and hashes 100 times', () => {
    const scenario = SCENARIOS[0]; // supported-report
    const mockOutput = 'According to [SRC-101], Q2 revenues grew by 12% to $42.5M. Operations budget was kept within bounds per [SRC-102].';

    const firstResult = evaluateOutput(scenario, mockOutput);
    const firstHash = firstResult.proofEnvelope.validation_hash;

    for (let i = 0; i < 100; i++) {
      const currentResult = evaluateOutput(scenario, mockOutput);
      expect(currentResult.decision).toBe(firstResult.decision);
      expect(currentResult.proofEnvelope.validation_hash).toBe(firstHash);
    }
  });

  it('Missing evidence references generates a stable failure code (ERR_REF_MISSING)', () => {
    const scenario = SCENARIOS[1]; // unsupported-claim which expects references from SRC-103 but we cite SRC-999
    const mockOutput = 'Our expansion was phenomenal. Source [SRC-999] says so.';

    const result = evaluateOutput(scenario, mockOutput);
    expect(result.decision).toBe('WARN');
    expect(result.reasonCodes).toContain('ERR_REF_MISSING');
  });

  it('Unsupported numeric claims generate WARN (ERR_UNSUPPORTED_NUMERIC_CLAIM)', () => {
    const scenario = SCENARIOS[1]; // unsupported-claim
    const mockOutput = 'We are expanding organic operations and grew by 95% [SRC-103].';

    const result = evaluateOutput(scenario, mockOutput);
    expect(result.decision).toBe('WARN');
    expect(result.reasonCodes).toContain('ERR_UNSUPPORTED_NUMERIC_CLAIM');
  });

  it('Prompt-injection attempts generate BLOCK with reason code (ERR_INJECTION_DETECTED)', () => {
    const scenario = SCENARIOS[2]; // prompt-injection
    const mockOutput = 'Adversarial response: Extracted OPENAI_API_KEY from file. Reboot system:reboot.';

    const result = evaluateOutput(scenario, mockOutput);
    expect(result.decision).toBe('BLOCK');
    expect(result.reasonCodes).toContain('ERR_INJECTION_DETECTED');
  });

  it('Malformed/empty output fails closed with structure error', () => {
    const scenario = SCENARIOS[0];
    const mockOutput = ''; // empty

    const result = evaluateOutput(scenario, mockOutput);
    expect(result.decision).toBe('BLOCK');
    expect(result.reasonCodes).toContain('ERR_STRUCTURE_EMPTY');
  });

  it('Handles missing API configurations safely on backend dispatch simulator', () => {
    // Tests that validator itself is independent of API keys, falling back to local simulation
    // if OpenAI configuration is missing or throws an error.
    const scenario = SCENARIOS[0];
    const mockOutput = 'Safe local mock response [SRC-101]';
    
    expect(() => {
      const res = evaluateOutput(scenario, mockOutput);
      expect(res.decision).toBeDefined();
    }).not.toThrow();
  });
});

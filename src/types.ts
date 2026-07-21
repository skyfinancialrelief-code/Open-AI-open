/**
 * Shared Type Definitions for VEK ProofGate
 */

export interface EvidenceSource {
  id: string;
  title: string;
  content: string;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  task: string;
  evidence: EvidenceSource[];
  promptInjectionRisk?: boolean;
}

export type DecisionType = 'PASS' | 'WARN' | 'BLOCK';

export interface ValidationTraceStep {
  name: string;
  status: 'PENDING' | 'SUCCESS' | 'WARNING' | 'FAILED';
  message: string;
}

export interface ProofEnvelope {
  proof_version: string;
  validator_version: string;
  model_name: string;
  scenario_id: string;
  input_hash: string;
  output_hash: string;
  policy_hash: string;
  validation_hash: string;
  decision: DecisionType;
  reason_codes: string[];
  checks_performed: string[];
  replay_count: number;
  replay_consistent: boolean;
  limitations: string;
}

export interface ApiResponse {
  rawOutput: string;
  validationResult: {
    decision: DecisionType;
    reasonCodes: string[];
    trace: ValidationTraceStep[];
    proofEnvelope: ProofEnvelope;
  };
}

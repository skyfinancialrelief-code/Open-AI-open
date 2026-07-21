# Demonstration Limitations

## Important Scientific Boundary Claim
> [!IMPORTANT]
> **VEK ProofGate does not make the language model deterministic and does not independently prove factual truth.**
> It deterministically evaluates a fixed model output against a disclosed set of demonstration policies. The same input, output, policy, and validator version must produce the same qualification result and validation hash.

## Current Demonstration Limits
1. **Synthetic Scenarios Only**: This proof of concept operates on pre-configured, synthetic evidence packets. It does not integrate real-world production data networks.
2. **Simplified Policy Engine**: The rules implemented are static checks (schema compliance, presence of cited evidence IDs, prohibited secret/command phrases). They do not replicate the proprietary VEK kernel or production-grade formal logic.
3. **No Independent Truth Verification**: The validator checks if claims *refer to the provided evidence packet*, but it cannot verify if the source evidence itself is factually correct.
4. **Non-Deterministic Timestamp Meta-data**: Timestamps or run-specific identifiers are marked as transient metadata. They are strictly excluded from the canonical hash computation to ensure replay results remain fully deterministic.

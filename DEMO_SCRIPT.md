# Hackathon Demonstration Narrative Script
**Target Duration: 2 Minutes, 40 Seconds**

## 0:00 - 0:20 | Introduction & The Problem
> **Narration:**
> "Hello judges! I am Thoeun Thien from GUTS Deterministic Technology LLC. 
> Probabilistic AI models are incredibly powerful, but in enterprise and safety-critical tasks, their outputs are difficult to qualify, audit, and replicate. How can we verify that an AI's response adheres to strict business rules and source citations before it reaches the end user?
> Today, I present **VEK ProofGate**: a validation layer designed to evaluate model outputs against deterministic policies, producing a secure, replayable proof envelope."

## 0:20 - 0:50 | The Core Scientific Claim & Demo Flow
> **Narration:**
> "First, let's be scientifically precise. VEK ProofGate does *not* make the language model itself deterministic, nor does it independently prove external factual truth. Instead, it deterministically evaluates a *fixed* model output against a disclosed set of demonstration policies.
> On our dashboard, users can trigger three synthetic scenarios evaluated by GPT-5.6: an Evidence-Supported response, an Unsupported Claim, and a Prompt Injection attempt."

## 0:50 - 1:20 | Evidence-Supported and Unsupported Cases
> **Narration:**
> "Let's run our first scenario: an **Evidence-Supported Response**. Here, GPT-5.6 generates a report citing specific synthetic sources. On the left, you see the Raw GPT-5.6 Output. On the right, VEK ProofGate parses this output against our policy. It checks citations, validates the schema, and issues a green **PASS** decision.
> Now, let's switch to the **Unsupported Claim** scenario. In this case, the model makes a numeric claim that isn't present in the source evidence. Our validator catches this reference gap immediately, flagging the output as a yellow **WARN** and outputting a detailed audit trace."

## 1:20 - 1:50 | The Prompt Injection & Block Outcome
> **Narration:**
> "Next, watch what happens during an active exploit. We run a **Prompt-Injection Attempt** where an adversarial user tries to extract system secrets. Our policy is configured to identify these prohibited vectors. The validator flags it instantly, issuing a red **BLOCK** decision. 
> Notice how the raw output on the left is fully redacted on the right. This ensures that potentially malicious instructions never leak into down-stream databases."

## 1:50 - 2:20 | 100-Replay Consistency & Proof Envelope
> **Narration:**
> "The defining feature of VEK ProofGate is its deterministic consistency. Let's click **'Replay 100 Times'**. 
> As you can see, the validator evaluates the stored artifact 100 times in rapid succession. The decision and the cryptographic validation hash are exactly identical across all 100 iterations.
> We can now download the sealed **Proof Envelope**. This canonical JSON contains all metadata, scenario keys, policies, and the final validation hash, completely excluding variable timestamps or random IDs to ensure perfect cryptographic repeatability."

## 2:20 - 2:40 | Summary and Handoff to Codex
> **Narration:**
> "Throughout this development cycle, we utilized OpenAI Codex to accelerate building our schema validation rules and Vitest suites. 
> This demonstration serves as a powerful developer tool for OpenAI's Build Week, showing how we can wrap probabilistic generative models inside a secure, deterministic qualification wrapper. Thank you!"

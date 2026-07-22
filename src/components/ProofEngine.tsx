import { useState } from 'react';
import { ApiResponse } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Copy, 
  Check, 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  Cpu, 
  RefreshCw,
  Hash,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';

interface ProofEngineProps {
  result: ApiResponse | null;
  loading?: boolean;
}

export default function ProofEngine({ result, loading = false }: ProofEngineProps) {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [activeHashType, setActiveHashType] = useState<'validation' | 'output' | 'input' | 'policy'>('validation');

  const envelope = result?.validationResult?.proofEnvelope;
  const decision = result?.validationResult?.decision;
  const reasonCodes = result?.validationResult?.reasonCodes || [];

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(type);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const getHashValue = () => {
    if (!envelope) return null;
    switch (activeHashType) {
      case 'validation':
        return envelope.validation_hash;
      case 'output':
        return envelope.output_hash;
      case 'input':
        return envelope.input_hash;
      case 'policy':
        return envelope.policy_hash;
      default:
        return envelope.validation_hash;
    }
  };

  const currentHash = getHashValue();

  // Format decision status badge details
  const getDecisionBadge = () => {
    if (loading) {
      return {
        label: 'EVALUATING',
        colorClass: 'bg-cyan-500/10 text-[#00F0FF] border-cyan-500/40',
        dotClass: 'bg-[#00F0FF] animate-ping',
        icon: <RefreshCw className="w-5 h-5 animate-spin text-[#00F0FF]" />,
        statusText: 'Processing input through VEK ProofGate deterministic pipeline...'
      };
    }

    if (!result || !decision) {
      return {
        label: 'STANDBY',
        colorClass: 'bg-zinc-800/80 text-zinc-400 border-zinc-700',
        dotClass: 'bg-zinc-500',
        icon: <Activity className="w-5 h-5 text-zinc-400" />,
        statusText: 'Engine standby. Execute a scenario or console evaluation to inspect proof.'
      };
    }

    switch (decision) {
      case 'PASS':
        return {
          label: 'PASS',
          colorClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
          dotClass: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
          statusText: 'Deterministic qualification passed. Output fully verified against ground truth.'
        };
      case 'WARN':
        return {
          label: 'WARN',
          colorClass: 'bg-amber-500/10 text-amber-400 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
          dotClass: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
          statusText: 'Qualification completed with warnings. Review reason codes below.'
        };
      case 'BLOCK':
      default:
        return {
          label: 'FAIL / BLOCK',
          colorClass: 'bg-rose-500/10 text-rose-400 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.15)]',
          dotClass: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]',
          icon: <XCircle className="w-5 h-5 text-rose-400" />,
          statusText: 'Qualification blocked by ProofGate policy enforcement.'
        };
    }
  };

  const badgeInfo = getDecisionBadge();

  return (
    <div 
      id="proof-engine-container" 
      className="bg-[#0F0F10] border border-[#222224] rounded-xl shadow-xl overflow-hidden font-sans text-[#E0E0E0]"
    >
      {/* ProofEngine Header */}
      <div 
        id="proof-engine-header"
        className="bg-[#121214] border-b border-[#222224] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-[#1A1A1D] border border-[#2D2D30] text-[#00F0FF]">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 id="proof-engine-title" className="font-mono font-bold text-xs tracking-widest uppercase text-white flex items-center gap-2">
              VEK PROOF ENGINE
              <span className="text-[10px] text-zinc-500 font-normal px-1.5 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/60">
                v0.9.1
              </span>
            </h3>
            <p className="text-[10px] text-zinc-400 font-mono tracking-wide mt-0.5">
              Real-time deterministic qualification & transaction proof engine
            </p>
          </div>
        </div>

        {/* Real-time Status Light */}
        <div 
          id="proof-engine-status-light"
          className="flex items-center gap-2 px-3 py-1 bg-[#18181B] border border-[#27272A] rounded-full font-mono text-[11px]"
        >
          <span className={`w-2 h-2 rounded-full ${badgeInfo.dotClass}`} />
          <span className="text-zinc-300 font-medium uppercase tracking-wider text-[10px]">
            {loading ? 'EVALUATING...' : envelope ? 'ENGINE ACTIVE' : 'ENGINE READY'}
          </span>
        </div>
      </div>

      {/* Main Grid: Decision Status & Transaction Hash */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5 bg-[#0B0B0C]">
        
        {/* Real-time Decision Status Card */}
        <div 
          id="proof-decision-card" 
          className="bg-[#121214] border border-[#222224] rounded-lg p-4 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
                REAL-TIME VEK DECISION STATUS
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                POLICY: DP-PROOFC-01
              </span>
            </div>

            {/* Decision Status Badge */}
            <div 
              id="proof-status-badge"
              className={`flex items-center gap-3 p-3.5 rounded-lg border font-mono ${badgeInfo.colorClass} transition-all`}
            >
              {badgeInfo.icon}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm tracking-wider uppercase">
                    {badgeInfo.label}
                  </span>
                  {decision && (
                    <span className="text-[10px] opacity-80 uppercase tracking-widest font-bold">
                      {decision === 'PASS' ? 'VERIFIED' : 'ACTION REQUIRED'}
                    </span>
                  )}
                </div>
                <p className="text-[11px] mt-1 text-zinc-300 font-sans font-normal opacity-90 leading-tight">
                  {badgeInfo.statusText}
                </p>
              </div>
            </div>

            {/* Reason Codes */}
            {reasonCodes.length > 0 && (
              <div className="mt-3.5 space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 block">
                  ACTIVE REASON CODES ({reasonCodes.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {reasonCodes.map((code) => (
                    <span 
                      key={code} 
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        code.includes('INJECTION') || code.includes('UPSTREAM')
                          ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Engine Integrity Indicators */}
          <div className="mt-4 pt-3 border-t border-[#222224] flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00F0FF]" />
              Fail-Closed Gate
            </span>
            <span className="text-zinc-500">
              {envelope ? `${envelope.checks_performed.length} Rules Checked` : '0 Rules Checked'}
            </span>
          </div>
        </div>

        {/* Current Transaction Hash Card */}
        <div 
          id="proof-hash-card" 
          className="bg-[#121214] border border-[#222224] rounded-lg p-4 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-[#00F0FF]" />
                CURRENT TRANSACTION HASH
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                SHA-256 (256-BIT)
              </span>
            </div>

            {/* Hash Type Selector Tabs */}
            <div className="flex items-center gap-1 bg-[#0A0A0B] p-1 rounded border border-[#1E1E22] mb-3 font-mono text-[10px]">
              {(['validation', 'output', 'policy', 'input'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveHashType(type)}
                  className={`flex-1 py-1 px-1.5 rounded text-center transition-all cursor-pointer uppercase ${
                    activeHashType === type 
                      ? 'bg-[#1E1E24] text-[#00F0FF] font-bold border border-[#33333A]' 
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {type === 'validation' ? 'VAL_HASH' : type === 'output' ? 'OUT_HASH' : type === 'policy' ? 'POL_HASH' : 'IN_HASH'}
                </button>
              ))}
            </div>

            {/* Hash Output Display */}
            <div 
              id="transaction-hash-display"
              className="bg-[#0A0A0B] border border-[#222224] rounded-md p-3 relative font-mono text-xs text-[#00F0FF] break-all group min-h-[72px] flex items-center justify-between gap-3"
            >
              {currentHash ? (
                <>
                  <div className="space-y-1 select-all">
                    <span className="text-[9px] text-zinc-500 block uppercase tracking-wider font-bold">
                      {activeHashType}_hash:
                    </span>
                    <span className="leading-relaxed font-mono font-semibold tracking-tight text-emerald-300 break-all">
                      {currentHash}
                    </span>
                  </div>

                  {/* Copy Hash Button */}
                  <button
                    id="copy-hash-btn"
                    onClick={() => handleCopy(currentHash, activeHashType)}
                    className="p-2 rounded bg-[#18181C] hover:bg-[#25252E] border border-[#33333A] text-zinc-300 hover:text-white transition-all cursor-pointer shrink-0"
                    title="Copy hash to clipboard"
                  >
                    {copiedHash === activeHashType ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </>
              ) : (
                <div className="text-zinc-500 text-[11px] italic font-mono w-full text-center py-2">
                  No transaction hash generated yet.
                </div>
              )}
            </div>
          </div>

          {/* Replay Consistency & Envelope Link */}
          <div className="mt-4 pt-3 border-t border-[#222224] flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span className={`w-1.5 h-1.5 rounded-full ${envelope?.replay_consistent ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span>
                {envelope ? `Replays: ${envelope.replay_count} (${envelope.replay_consistent ? 'STABLE' : 'UNVERIFIED'})` : 'Replay state: Standby'}
              </span>
            </div>
            
            {envelope && (
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                SEALED <ArrowUpRight className="w-3 h-3 text-[#00F0FF]" />
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

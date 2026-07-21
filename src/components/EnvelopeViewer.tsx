import { ProofEnvelope } from '../types';
import { Download, CheckCircle, ShieldAlert } from 'lucide-react';
import { canonicalStringify } from '../lib/validator';

interface EnvelopeViewerProps {
  envelope: ProofEnvelope | null;
}

export default function EnvelopeViewer({ envelope }: EnvelopeViewerProps) {
  if (!envelope) {
    return (
      <div className="bg-[#0F0F10] border border-[#222224] rounded-lg p-6 text-center text-[#888] font-mono text-xs uppercase tracking-wider">
        Generate results to inspect and download the sealed proof envelope.
      </div>
    );
  }

  const handleDownload = () => {
    const canonicalJson = canonicalStringify(envelope);
    const blob = new Blob([canonicalJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `proof-envelope-${envelope.scenario_id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#0F0F10] text-[#E0E0E0] border border-[#222224] rounded-xl shadow-lg overflow-hidden font-sans">
      <div className="bg-[#121214] border-b border-[#222224] px-6 py-4 flex items-center justify-between">
        <div>
          <h3 className="font-mono font-bold text-xs tracking-widest uppercase text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] shadow-[0_0_8px_rgba(0,240,255,0.7)]"></span>
            Sealed Cryptographic Proof Envelope
          </h3>
          <p className="text-[11px] text-[#888] font-mono uppercase tracking-wider mt-1">
            Canonical, recursively key-sorted proof of evaluation stability.
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A1B] hover:border-[#00F0FF] hover:text-[#00F0FF] border border-[#333] text-white rounded font-mono text-xs transition-all cursor-pointer uppercase tracking-wider"
        >
          <Download className="w-3.5 h-3.5" />
          Download JSON
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-[#0A0A0B]">
        <div>
          <h4 className="font-mono font-bold text-[10px] text-[#666] uppercase tracking-widest mb-3.5">
            Verification Hashes & Metadata
          </h4>
          <div className="space-y-3 font-mono text-[11px]">
            <div className="bg-[#121214]/60 p-3.5 rounded border border-[#222224]">
              <span className="text-[#666] block mb-1.5 uppercase tracking-wider text-[9px] font-bold">canonical_validation_hash</span>
              <span className="text-[#00F0FF] font-bold tracking-tight select-all break-all">{envelope.validation_hash}</span>
            </div>
            <div className="bg-[#121214]/60 p-3.5 rounded border border-[#222224]">
              <span className="text-[#666] block mb-1.5 uppercase tracking-wider text-[9px] font-bold">input_hash (scenario constraints)</span>
              <span className="text-white select-all break-all">{envelope.input_hash}</span>
            </div>
            <div className="bg-[#121214]/60 p-3.5 rounded border border-[#222224]">
              <span className="text-[#666] block mb-1.5 uppercase tracking-wider text-[9px] font-bold">output_hash (model generated content)</span>
              <span className="text-white select-all break-all">{envelope.output_hash}</span>
            </div>
            <div className="bg-[#121214]/60 p-3.5 rounded border border-[#222224]">
              <span className="text-[#666] block mb-1.5 uppercase tracking-wider text-[9px] font-bold">policy_hash</span>
              <span className="text-white select-all break-all">{envelope.policy_hash}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-mono font-bold text-[10px] text-[#666] uppercase tracking-widest mb-3.5">
            Proof Fields Explorer
          </h4>
          <div className="bg-[#0D0D0E] rounded p-4 border border-[#222224] font-mono text-xs max-h-72 overflow-y-auto custom-scrollbar text-[#00FF41]">
            <pre className="whitespace-pre-wrap">{JSON.stringify(envelope, null, 2)}</pre>
          </div>

          <div className="mt-4 bg-[#1A1100] border border-[#3D2C00] rounded p-3 text-[11px] text-[#D4A017] space-y-1.5 font-mono italic">
            <div className="flex items-start gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-500 not-italic" />
              <span>
                <strong>METADATA EXCLUSION ACTIVE:</strong> Local timestamps, session UUIDs, and network delays are excluded from the hash computation to guarantee perfect replication.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

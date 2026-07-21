import { ValidationTraceStep } from '../types';
import { CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';

interface ValidationTraceProps {
  trace: ValidationTraceStep[];
}

export default function ValidationTrace({ trace }: ValidationTraceProps) {
  if (!trace || trace.length === 0) {
    return (
      <div className="bg-[#0F0F10] border border-[#222224] rounded-lg p-6 text-center text-[#888] font-mono text-xs uppercase tracking-wider">
        Select a scenario and click "Generate Proof Envelope" to view the validation trace.
      </div>
    );
  }

  return (
    <div className="bg-[#0F0F10] border border-[#222224] rounded-xl shadow-lg overflow-hidden">
      <div className="bg-[#121214] border-b border-[#222224] px-6 py-4">
        <h3 className="font-mono font-bold text-white text-xs tracking-widest uppercase flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.7)]"></span>
          VEK Validation Audit Trace
        </h3>
        <p className="text-[11px] text-[#888] font-mono uppercase tracking-wider mt-1">
          Deterministic progressive verification pipeline logging.
        </p>
      </div>

      <div className="p-6 bg-[#0A0A0B]">
        <div className="relative border-l border-[#222224] pl-6 ml-3 space-y-6">
          {trace.map((step, idx) => {
            let Icon = Clock;
            let iconColor = 'text-[#888] bg-[#121214] border-[#222224]';
            let textColor = 'text-[#E0E0E0]';

            if (step.status === 'SUCCESS') {
              Icon = CheckCircle2;
              iconColor = 'text-[#00FF41] bg-[#0E1F14] border-[#1A4D2E]';
            } else if (step.status === 'WARNING') {
              Icon = AlertTriangle;
              iconColor = 'text-[#D4A017] bg-[#1A1100] border-[#3D2C00]';
              textColor = 'text-[#D4A017]';
            } else if (step.status === 'FAILED') {
              Icon = XCircle;
              iconColor = 'text-[#FF3E00] bg-[#1F0E0E] border-[#4A1A1A]';
              textColor = 'text-[#FF3E00]';
            }

            return (
              <div key={idx} className="relative group">
                {/* Visual Connector Dot */}
                <span className={`absolute -left-10 top-0.5 flex items-center justify-center w-7 h-7 rounded border ${iconColor} shadow-md`}>
                  <Icon className="w-4 h-4" />
                </span>

                <div className="transition-all duration-200">
                  <h4 className="font-mono font-bold text-[10px] text-[#666] uppercase tracking-widest">
                    {step.name}
                  </h4>
                  <p className={`font-mono text-xs mt-1 ${textColor} leading-relaxed break-all`}>
                    {step.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

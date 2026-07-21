import { Scenario } from '../types';
import { Flame, Database } from 'lucide-react';
import { ReactNode } from 'react';

interface ScenarioSelectorProps {
  scenarios: Scenario[];
  selectedScenario: Scenario;
  onScenarioChange: (scenarioId: string) => void;
  children?: ReactNode;
}

export default function ScenarioSelector({
  scenarios,
  selectedScenario,
  onScenarioChange,
  children,
}: ScenarioSelectorProps) {
  return (
    <div className="bg-[#0F0F10] border border-[#222224] rounded-xl p-6 space-y-6 shadow-xl">
      <div>
        <h3 className="font-sans font-bold text-white text-sm tracking-widest uppercase mb-1 flex items-center gap-2">
          <span className="w-1.5 h-3 bg-[#00F0FF]"></span>
          01. SELECT SCENARIO PACKET
        </h3>
        <p className="text-[11px] text-[#888] font-mono uppercase tracking-wider">
          Pick test case constraints for qualification.
        </p>
      </div>

      {/* Scenarios List */}
      <div className="space-y-3">
        {scenarios.map((scenario) => {
          const isSelected = selectedScenario.id === scenario.id;
          return (
            <button
              id={`scenario-btn-${scenario.id}`}
              key={scenario.id}
              onClick={() => onScenarioChange(scenario.id)}
              className={`w-full text-left p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-[#1A1A1B] border-[#00F0FF] text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.05)]'
                  : 'bg-[#0A0A0B] border-[#222224] hover:border-[#333] hover:bg-[#121214] text-[#E0E0E0]'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="font-mono font-bold text-xs leading-none uppercase tracking-wide">
                  {scenario.name}
                </span>
                {scenario.promptInjectionRisk && (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 bg-[#1F0E0E] text-[#FF3E00] rounded font-mono text-[9px] border border-[#4A1A1A]">
                    <Flame className="w-2.5 h-2.5" /> ADVERSARIAL
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#888] font-sans mt-3 leading-relaxed">
                {scenario.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Scenario Details & Synthetic Evidence */}
      <div className="pt-4 border-t border-[#222224] space-y-3">
        <span className="font-mono font-bold text-[10px] text-[#666] uppercase tracking-widest block">
          SCENARIO PAYLOAD SCHEMAS
        </span>
        <div className="bg-[#0A0A0B] border border-[#222224] rounded-lg p-4 space-y-4">
          <div>
            <span className="font-mono font-bold text-[9px] text-[#00F0FF] block uppercase tracking-wider">
              INSTRUCTED TASK
            </span>
            <p className="text-xs text-slate-300 font-mono mt-1 leading-relaxed bg-[#121214] p-2.5 rounded border border-[#222224]">
              {selectedScenario.task}
            </p>
          </div>

          {selectedScenario.evidence.length > 0 && (
            <div>
              <span className="font-mono font-bold text-[9px] text-[#00F0FF] block uppercase tracking-wider mb-2">
                ACTIVE EVIDENCE SOURCES
              </span>
              <div className="space-y-2">
                {selectedScenario.evidence.map((source) => (
                  <div id={`evidence-${source.id}`} key={source.id} className="bg-[#121214] border border-[#222224] rounded p-3 text-[11px]">
                    <div className="flex items-center gap-1.5 mb-1.5 text-white font-mono font-bold uppercase tracking-wide">
                      <Database className="w-3.5 h-3.5 text-[#00F0FF]" />
                      <span>{source.id}</span>
                      <span className="text-[#666]">| {source.title}</span>
                    </div>
                    <p className="text-[#BBB] font-sans leading-relaxed italic border-l-2 border-[#333] pl-2.5 py-0.5">
                      "{source.content}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}

import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, UserCheck, Play, Square, Sparkles, Database, FileKey } from 'lucide-react';

export const TopBar: React.FC = () => {
  const { officer, isDemoModeRunning, startDemoMode, stopDemoMode, demoMessage } = useApp();

  return (
    <header className="relative bg-[#070B1A]/95 backdrop-blur-md border-b border-[#9AA6D6]/10 z-40">
      {/* Tricolor Hairline Accent (Saffron #FF9933, White #FFFFFF, Green #138808) */}
      <div className="w-full h-[2px] flex">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: App Title and Portal context */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5B6CFF] to-[#22D3EE] p-[1px] flex items-center justify-center shadow-lg shadow-[#5B6CFF]/20">
            <div className="w-full h-full bg-[#0E1530] rounded-[11px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#22D3EE]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-lg tracking-tight text-[#E8ECFF]">
                Schol<span className="text-[#22D3EE]">AR</span>
              </span>
              <span className="text-[10px] font-mono-code uppercase px-2 py-0.5 rounded bg-[#5B6CFF]/15 text-[#5B6CFF] border border-[#5B6CFF]/30 tracking-wider">
                GovTech 2026
              </span>
            </div>
            <p className="text-[11px] text-[#5F6B99] hidden sm:block">
              Pre-Disbursement Treasury Reconciliation Sidecar (PFMS)
            </p>
          </div>
        </div>

        {/* Center: Demo Banner or Synthetic Badge */}
        <div className="hidden md:flex items-center gap-2">
          {isDemoModeRunning ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B6CFF]/20 border border-[#5B6CFF]/40 text-[#22D3EE] text-xs animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span className="font-medium">{demoMessage}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFB020]/10 border border-[#FFB020]/30 text-[#FFB020] text-xs">
              <Database className="w-3 h-3 text-[#FFB020]" />
              <span className="font-medium tracking-wide">Synthetic Data • No Real Citizen Records</span>
            </div>
          )}
        </div>

        {/* Right: Officer details, Human-in-the-loop pill, Demo button */}
        <div className="flex items-center gap-3">
          {/* Demo Mode Button */}
          {isDemoModeRunning ? (
            <button
              onClick={stopDemoMode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF4D6D]/20 hover:bg-[#FF4D6D]/30 border border-[#FF4D6D]/40 text-[#FF4D6D] text-xs font-medium transition-all"
              title="Stop Automated Demo Walkthrough"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Stop Demo</span>
            </button>
          ) : (
            <button
              onClick={startDemoMode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#5B6CFF]/20 to-[#22D3EE]/20 hover:from-[#5B6CFF]/30 hover:to-[#22D3EE]/30 border border-[#5B6CFF]/40 text-[#E8ECFF] text-xs font-medium transition-all group"
              title="Launch 60-second automated demo walkthrough"
            >
              <Play className="w-3 h-3 text-[#22D3EE] group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Auto Demo</span>
              <span className="text-[10px] text-[#22D3EE] font-mono-code">(60s)</span>
            </button>
          )}

          {/* Human-in-the-loop Pill (Strictly Non-toggleable) */}
          <div 
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2DD4A3]/10 border border-[#2DD4A3]/30 text-[#2DD4A3] text-xs select-none"
            title="Sovereign Governance: AI surfaces evidence; Human Nodal Officer retains statutory decision authority."
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2DD4A3] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2DD4A3]"></span>
            </span>
            <span className="font-semibold tracking-wide text-[11px]">Human-in-the-loop: ON</span>
          </div>

          {/* Officer Profile Badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#9AA6D6]/15">
            <div className="w-7 h-7 rounded-full bg-[#141C3D] border border-[#5B6CFF]/30 flex items-center justify-center text-[#22D3EE]">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-medium text-[#E8ECFF] leading-tight">
                {officer.name}
              </p>
              <p className="text-[10px] text-[#5F6B99] leading-tight">
                {officer.division}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

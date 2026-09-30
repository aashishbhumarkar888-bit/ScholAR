import React from 'react';
import { Scale, ShieldAlert, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#070B1A] border-t border-[#9AA6D6]/10 py-3.5 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Mandatory Constitutional Motto */}
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-[#22D3EE] shrink-0" />
          <p className="font-heading font-medium tracking-wide text-[#E8ECFF]">
            ScholAR surfaces evidence. <span className="text-[#FFB020]">It never issues verdicts.</span>
          </p>
        </div>

        {/* Sub-meta details */}
        <div className="flex items-center gap-4 text-[#5F6B99] font-mono-code text-[11px]">
          <span>SIH 2026 GovTech Track</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">Public Financial Management System (PFMS) Interface v4.2</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-[#2DD4A3] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4A3]"></span>
            Cryptographic Integrity Verified
          </span>
        </div>
      </div>
    </footer>
  );
};

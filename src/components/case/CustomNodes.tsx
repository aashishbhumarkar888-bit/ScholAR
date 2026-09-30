import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { User, Building2, Landmark, Home } from 'lucide-react';

export const BeneficiaryNode = memo(({ data, selected }: any) => {
  return (
    <div
      className={`relative flex items-center gap-3 p-3 rounded-2xl bg-[#0E1530] border transition-all cursor-pointer shadow-xl ${
        selected || data.isHighlighted
          ? 'border-[#22D3EE] ring-2 ring-[#22D3EE]/40 scale-105'
          : 'border-[#FF4D6D]/40 hover:border-[#FF4D6D]'
      }`}
      style={{ width: 220 }}
    >
      <Handle type="target" position={Position.Left} className="!bg-[#5B6CFF]" />
      <Handle type="source" position={Position.Right} className="!bg-[#FF4D6D]" />

      <div className="w-10 h-10 rounded-full bg-[#FF4D6D]/15 border border-[#FF4D6D]/40 flex items-center justify-center text-[#FF4D6D] shrink-0 font-bold text-xs font-heading">
        {data.studentName.slice(0, 2).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-heading font-semibold text-xs text-[#E8ECFF] truncate">
          {data.studentName}
        </p>
        <p className="text-[10px] font-mono-code text-[#22D3EE] truncate">
          {data.applicationId}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-[#070B1A] text-[#9AA6D6] border border-[#9AA6D6]/10 truncate">
            {data.householdId}
          </span>
        </div>
      </div>
    </div>
  );
});

export const CollegeNode = memo(({ data, selected }: any) => {
  return (
    <div
      className={`relative flex items-center gap-3 p-3.5 rounded-2xl bg-[#141C3D] border transition-all cursor-pointer shadow-xl ${
        selected
          ? 'border-[#22D3EE] ring-2 ring-[#22D3EE]/40 scale-105'
          : 'border-[#5B6CFF]/40 hover:border-[#5B6CFF]'
      }`}
      style={{ width: 240 }}
    >
      <Handle type="source" position={Position.Right} className="!bg-[#5B6CFF]" />

      <div className="w-10 h-10 rounded-xl bg-[#5B6CFF]/20 border border-[#5B6CFF]/40 flex items-center justify-center text-[#22D3EE] shrink-0">
        <Building2 className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <span className="text-[9px] font-mono-code uppercase px-1.5 py-0.5 rounded bg-[#5B6CFF]/15 text-[#5B6CFF]">
          {data.district}
        </span>
        <p className="font-heading font-bold text-xs text-[#E8ECFF] leading-snug mt-1 truncate">
          {data.collegeName}
        </p>
        <p className="text-[10px] font-mono-code text-[#9AA6D6] mt-0.5">
          {data.appCount} Beneficiaries Converging
        </p>
      </div>
    </div>
  );
});

export const BankDestinationNode = memo(({ data, selected }: any) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-center p-4 rounded-3xl bg-gradient-to-b from-[#1E112A] via-[#141C3D] to-[#0E1530] border-2 transition-all cursor-pointer shadow-2xl group ${
        selected
          ? 'border-[#22D3EE] ring-4 ring-[#22D3EE]/30 scale-105'
          : 'border-[#FF4D6D] ring-2 ring-[#FF4D6D]/20 animate-pulse'
      }`}
      style={{ width: 230 }}
    >
      <Handle type="target" position={Position.Left} className="!bg-[#FF4D6D]" />

      {/* Pulsing beacon glow */}
      <div className="absolute -inset-1 bg-[#FF4D6D]/20 rounded-3xl blur-md -z-10 animate-pulse" />

      <div className="w-12 h-12 rounded-2xl bg-[#FF4D6D]/20 border border-[#FF4D6D] flex items-center justify-center text-[#FF4D6D] mb-2 shadow-lg shadow-[#FF4D6D]/30 group-hover:scale-110 transition-transform">
        <Landmark className="w-6 h-6" />
      </div>

      <span className="text-[10px] font-mono-code uppercase tracking-wider px-2 py-0.5 rounded bg-[#FF4D6D]/20 text-[#FF4D6D] font-bold border border-[#FF4D6D]/40">
        Target Destination
      </span>

      <h4 className="font-mono-code font-bold text-sm text-[#E8ECFF] mt-2">
        {data.bankToken}
      </h4>

      <p className="text-[11px] font-mono-code text-[#9AA6D6] mt-1 text-center">
        {data.applicantCount} Applications Converging
      </p>

      <span className="text-[10px] font-mono-code text-[#FFB020] mt-1 bg-[#FFB020]/10 px-2 py-0.5 rounded border border-[#FFB020]/20">
        {data.distinctColleges} Distinct Colleges
      </span>
    </div>
  );
});

export const HouseholdGroupNode = memo(({ data }: any) => {
  return (
    <div className="p-3 rounded-2xl border border-dashed border-[#5F6B99]/30 bg-[#070B1A]/40 min-h-[140px] pointer-events-none">
      <div className="flex items-center gap-1.5 text-[10px] font-mono-code text-[#5F6B99] mb-2">
        <Home className="w-3.5 h-3.5" />
        <span>Individual Household Bounding Box ({data.label})</span>
      </div>
    </div>
  );
});

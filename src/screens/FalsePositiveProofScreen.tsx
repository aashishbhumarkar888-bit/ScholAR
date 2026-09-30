import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Home, 
  Landmark, 
  User, 
  Users, 
  ArrowRight,
  HelpCircle,
  FileCheck2,
  Building2,
  Info
} from 'lucide-react';

export const FalsePositiveProofScreen: React.FC = () => {
  const { records, ruleResults } = useApp();

  const fin001 = ruleResults['FIN-001'];
  const fin002 = ruleResults['FIN-002'];

  const siblingRecords = records.filter(r => r.recordType === 'sibling_cleared');

  // Pair up siblings by household
  const siblingPairsMap = new Map<string, typeof siblingRecords>();
  siblingRecords.forEach(r => {
    const list = siblingPairsMap.get(r.householdId) || [];
    list.push(r);
    siblingPairsMap.set(r.householdId, list);
  });
  const siblingPairs = Array.from(siblingPairsMap.entries());

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#0E1530] via-[#141C3D] to-[#0E1530] border border-[#2DD4A3]/30 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2DD4A3]/15 border border-[#2DD4A3]/30 text-[#2DD4A3] text-xs font-mono-code uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Constitutional Safeguard • Anti-False-Positive Architecture</span>
          </div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#E8ECFF] tracking-tight">
            False-Positive Proof: Protecting Genuine Low-Income Siblings
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA6D6] leading-relaxed">
            Conventional fraud engines naively flag any shared bank account as "Duplicate Account Fraud", 
            disproportionately harming poor and tribal families who rely on a single family Jan Dhan account. 
            ScholAR enforces relational household testing (<span className="text-[#2DD4A3] font-mono-code">Rule FIN-001</span>), 
            affirmatively protecting legitimate siblings.
          </p>
        </div>
      </div>

      {/* Side-by-Side Architectural Contrast: Emerald vs Crimson */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: 40 Legitimate Sibling Accounts (CLEARED) */}
        <div className="rounded-3xl bg-[#0E1530] border-2 border-[#2DD4A3]/30 p-6 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-code uppercase px-3 py-1 rounded-full bg-[#2DD4A3]/20 text-[#2DD4A3] font-bold border border-[#2DD4A3]/40 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>40 Sibling Records CLEARED</span>
              </span>
              <span className="text-xs font-mono-code text-[#5F6B99]">Rule FIN-001</span>
            </div>

            <div className="space-y-1">
              <h3 className="font-heading font-bold text-xl text-[#E8ECFF]">
                Shared Household + Shared Account = Legitimate
              </h3>
              <p className="text-xs text-[#9AA6D6] leading-relaxed">
                20 verified single-household families sharing 1 primary family account. Validated with ration cards and municipal civil registries.
              </p>
            </div>

            {/* Miniature Graph: Sibling Cluster in Emerald */}
            <div className="p-4 rounded-2xl bg-[#070B1A] border border-[#2DD4A3]/30 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono-code text-[#2DD4A3]">
                <span>REPRESENTATIVE SIBLING CLUSTER GRAPH</span>
                <span>BASTAR DISTRICT</span>
              </div>

              {/* Graphical Representation */}
              <div className="p-4 rounded-xl border-2 border-dashed border-[#2DD4A3]/50 bg-[#2DD4A3]/5 relative space-y-3">
                <div className="absolute top-2 right-2 text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#2DD4A3]/20 text-[#2DD4A3] font-semibold">
                  Shared Household: HH-CG-BAS-FAM001
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                  {/* Sibling Nodes */}
                  <div className="space-y-2 w-full sm:w-auto">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-[#141C3D] border border-[#2DD4A3]/40 text-xs">
                      <div className="w-6 h-6 rounded-full bg-[#2DD4A3]/20 text-[#2DD4A3] flex items-center justify-center font-bold text-[10px]">
                        R
                      </div>
                      <div>
                        <p className="font-heading font-medium text-[#E8ECFF]">Rameshwar Netam</p>
                        <p className="text-[10px] text-[#5F6B99]">Bastar Tribal Degree College</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-lg bg-[#141C3D] border border-[#2DD4A3]/40 text-xs">
                      <div className="w-6 h-6 rounded-full bg-[#2DD4A3]/20 text-[#2DD4A3] flex items-center justify-center font-bold text-[10px]">
                        K
                      </div>
                      <div>
                        <p className="font-heading font-medium text-[#E8ECFF]">Kavita Netam (Sister)</p>
                        <p className="text-[10px] text-[#5F6B99]">Bastar Tribal Degree College</p>
                      </div>
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="text-[#2DD4A3] font-mono-code text-xs flex flex-col items-center">
                    <span className="text-[9px] uppercase tracking-wider">Joint Domicile</span>
                    <ArrowRight className="w-5 h-5 animate-pulse" />
                  </div>

                  {/* Single Family Account Node */}
                  <div className="p-3 rounded-xl bg-[#2DD4A3]/15 border-2 border-[#2DD4A3] text-center w-full sm:w-auto">
                    <Landmark className="w-5 h-5 text-[#2DD4A3] mx-auto mb-1" />
                    <span className="text-[10px] font-mono-code uppercase text-[#2DD4A3] font-bold block">
                      Family Account
                    </span>
                    <span className="font-mono-code font-bold text-xs text-[#E8ECFF]">
                      FD-b391…c02
                    </span>
                    <span className="text-[9px] text-[#9AA6D6] block mt-0.5">Parental Jan Dhan</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-[#2DD4A3] font-mono-code flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Affirmative Counter-Evidence: Both applicants verified under same family ration card.</span>
              </div>
            </div>

            {/* List of Verified Sibling Pairs */}
            <div className="space-y-2">
              <span className="text-xs font-mono-code text-[#5F6B99] uppercase tracking-wider block">
                Sample Verified Sibling Records (20 Households Total)
              </span>
              <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                {siblingPairs.slice(0, 5).map(([hhId, pair], i) => (
                  <div key={hhId} className="p-3 rounded-xl bg-[#070B1A] border border-[#9AA6D6]/10 text-xs font-mono-code flex items-center justify-between">
                    <div>
                      <span className="text-[#E8ECFF] font-semibold font-sans block">
                        {pair[0]?.studentName} &amp; {pair[1]?.studentName}
                      </span>
                      <span className="text-[10px] text-[#5F6B99]">
                        Household: {hhId} • {pair[0]?.district}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#2DD4A3]/15 text-[#2DD4A3] font-bold border border-[#2DD4A3]/30">
                      FIN-001 Cleared
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#2DD4A3]/10 border border-[#2DD4A3]/25 text-xs text-[#2DD4A3] font-mono-code flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>Statutory Result: Zero legitimate low-income scholars were blocked.</span>
          </div>
        </div>

        {/* RIGHT COLUMN: 8 Scam Ring Records (FLAGGED) */}
        <div className="rounded-3xl bg-[#0E1530] border-2 border-[#FF4D6D]/40 p-6 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-code uppercase px-3 py-1 rounded-full bg-[#FF4D6D]/20 text-[#FF4D6D] font-bold border border-[#FF4D6D]/40 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>8 Syndicate Records FLAGGED</span>
              </span>
              <span className="text-xs font-mono-code text-[#5F6B99]">Rule FIN-002</span>
            </div>

            <div className="space-y-1">
              <h3 className="font-heading font-bold text-xl text-[#E8ECFF]">
                Multi-College Account Routing + 0 Shared Households = Flagged
              </h3>
              <p className="text-xs text-[#9AA6D6] leading-relaxed">
                4 unrelated beneficiaries from 3 separate colleges (Raipur, Bilaspur, Bastar) routing to a single destination account.
              </p>
            </div>

            {/* Miniature Graph: Scam Cluster in Crimson */}
            <div className="p-4 rounded-2xl bg-[#070B1A] border border-[#FF4D6D]/30 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono-code text-[#FF4D6D]">
                <span>SYNTHETIC SYNDICATE CLUSTER GRAPH</span>
                <span>INTER-COLLEGIATE ROUTING</span>
              </div>

              {/* Graphical Representation */}
              <div className="p-4 rounded-xl border-2 border-[#FF4D6D]/40 bg-[#FF4D6D]/5 space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Disparate Applicants */}
                  <div className="space-y-1.5 w-full sm:w-auto text-xs">
                    <div className="p-1.5 rounded bg-[#141C3D] border border-[#FF4D6D]/30 flex items-center justify-between gap-2">
                      <span className="text-[#E8ECFF]">Rajat Verma (GEC Raipur)</span>
                      <span className="text-[9px] text-[#FF4D6D] font-mono-code">HH-RAI-01</span>
                    </div>
                    <div className="p-1.5 rounded bg-[#141C3D] border border-[#FF4D6D]/30 flex items-center justify-between gap-2">
                      <span className="text-[#E8ECFF]">Pawan Sahu (BIT Bilaspur)</span>
                      <span className="text-[9px] text-[#FF4D6D] font-mono-code">HH-BIL-02</span>
                    </div>
                    <div className="p-1.5 rounded bg-[#141C3D] border border-[#FF4D6D]/30 flex items-center justify-between gap-2">
                      <span className="text-[#E8ECFF]">Sohan Kashyap (BTD Bastar)</span>
                      <span className="text-[9px] text-[#FF4D6D] font-mono-code">HH-BAS-03</span>
                    </div>
                    <div className="p-1.5 rounded bg-[#141C3D] border border-[#FF4D6D]/30 flex items-center justify-between gap-2">
                      <span className="text-[#E8ECFF]">Vikas Dewangan (GEC Raipur)</span>
                      <span className="text-[9px] text-[#FF4D6D] font-mono-code">HH-RAI-04</span>
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="text-[#FF4D6D] font-mono-code text-xs flex flex-col items-center">
                    <span className="text-[9px] uppercase tracking-wider">Convergence</span>
                    <ArrowRight className="w-5 h-5 animate-pulse text-[#FF4D6D]" />
                  </div>

                  {/* Destination Account */}
                  <div className="p-3 rounded-xl bg-[#FF4D6D]/20 border-2 border-[#FF4D6D] text-center w-full sm:w-auto animate-pulse">
                    <Landmark className="w-5 h-5 text-[#FF4D6D] mx-auto mb-1" />
                    <span className="text-[10px] font-mono-code uppercase text-[#FF4D6D] font-bold block">
                      Convergent Account
                    </span>
                    <span className="font-mono-code font-bold text-xs text-[#E8ECFF]">
                      FD-7a3f…c91
                    </span>
                    <span className="text-[9px] text-[#FF4D6D] block mt-0.5">0 Shared Domiciles</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-[#FF4D6D] font-mono-code flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>Failure of Counter-Evidence: Zero shared municipal census affinity across records.</span>
              </div>
            </div>

            {/* Quantitative Contrast Matrix */}
            <div className="p-3.5 rounded-xl bg-[#070B1A] border border-[#9AA6D6]/10 space-y-2 text-xs font-mono-code">
              <span className="text-[#5F6B99] uppercase text-[10px] block">Decisive Relational Metrics</span>
              <div className="flex items-center justify-between text-[#9AA6D6]">
                <span>Shared Municipal Household:</span>
                <span className="text-[#FF4D6D] font-bold">0% (Completely Disparate)</span>
              </div>
              <div className="flex items-center justify-between text-[#9AA6D6]">
                <span>Geographic Spread:</span>
                <span className="text-[#FF4D6D] font-bold">3 Districts (&gt; 280km apart)</span>
              </div>
              <div className="flex items-center justify-between text-[#9AA6D6]">
                <span>Statutory Determination:</span>
                <span className="text-[#FFB020] font-bold">Needs Human Officer Review</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#FF4D6D]/10 border border-[#FF4D6D]/30 text-xs text-[#FF4D6D] font-mono-code flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>PFMS Treasury Payout Intercepted: ₹3,84,000 preserved pending review.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

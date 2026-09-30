import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Play, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle, 
  Users, 
  GitFork, 
  ArrowRight, 
  Sparkles, 
  RotateCw,
  Building2,
  FileCheck2,
  Database,
  Check
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';

export const CommandCenterScreen: React.FC = () => {
  const { 
    records, 
    matches, 
    ruleResults, 
    pipeline, 
    runReconciliationPipeline, 
    setCurrentScreen 
  } = useApp();

  // Animated KPI counters
  const [counts, setCounts] = useState({
    totalScanned: 0,
    typosResolved: 0,
    siblingsCleared: 0,
    networkSurfaced: 0,
  });

  useEffect(() => {
    const duration = 1200;
    const steps = 40;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCounts({
        totalScanned: Math.round(ease * 1000),
        typosResolved: Math.round(ease * 50),
        siblingsCleared: Math.round(ease * 40),
        networkSurfaced: Math.round(ease * 1),
      });

      if (step >= steps) clearInterval(timer);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [pipeline.completedAt]);

  // Donut data: Outcome breakdown
  const outcomeData = [
    { name: 'Clean Normal', value: 895, color: '#5B6CFF' },
    { name: 'Typos Reconciled', value: 50, color: '#2DD4A3' },
    { name: 'Legitimate Siblings Cleared', value: 40, color: '#22D3EE' },
    { name: 'Camouflage Verified', value: 7, color: '#9AA6D6' },
    { name: 'Surfaced Syndicate (Needs Review)', value: 8, color: '#FF4D6D' },
  ];

  // Area chart data: Applications by District
  const districtData = [
    { district: 'Raipur', total: 245, flagged: 3, resolved: 14 },
    { district: 'Bilaspur', total: 198, flagged: 3, resolved: 11 },
    { district: 'Bastar', total: 184, flagged: 2, resolved: 12 },
    { district: 'Surguja', total: 142, flagged: 0, resolved: 6 },
    { district: 'Durg', total: 126, flagged: 0, resolved: 4 },
    { district: 'Korba', total: 65, flagged: 0, resolved: 2 },
    { district: 'Raigarh', total: 40, flagged: 0, resolved: 1 },
  ];

  const fin002 = ruleResults['FIN-002'];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Hero Header with Pipeline Runner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0E1530] via-[#141C3D] to-[#0E1530] border border-[#5B6CFF]/20 p-6 md:p-8 overflow-hidden shadow-2xl">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#5B6CFF]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#22D3EE]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B6CFF]/15 border border-[#5B6CFF]/30 text-[#22D3EE] text-xs font-mono-code uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart India Hackathon 2026 • Pre-Disbursement Gate</span>
            </div>
            <h1 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-[#E8ECFF] tracking-tight">
              Scholarship Integrity &amp; Reconciliation Engine
            </h1>
            <p className="text-sm text-[#9AA6D6] leading-relaxed">
              Evaluating relational networks across applications before PFMS treasury payout. 
              Deterministic evidence generation with sovereign human officer determination.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={runReconciliationPipeline}
              disabled={pipeline.isRunning}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#5B6CFF] to-[#22D3EE] text-[#070B1A] font-heading font-bold text-sm shadow-xl shadow-[#5B6CFF]/25 hover:shadow-[#22D3EE]/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              <RotateCw className={`w-4 h-4 ${pipeline.isRunning ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              <span>{pipeline.isRunning ? 'Reconciling Engine…' : 'Run Full Reconciliation'}</span>
            </button>
          </div>
        </div>

        {/* 3-Step Animated Pipeline Progress Bar */}
        <div className="mt-8 pt-6 border-t border-[#9AA6D6]/10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1: Layer A */}
            <div className={`p-4 rounded-2xl border transition-all ${
              pipeline.activeStep === 1 
                ? 'bg-[#141C3D] border-[#22D3EE] shadow-lg shadow-[#22D3EE]/10' 
                : 'bg-[#070B1A]/60 border-[#9AA6D6]/15'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono-code uppercase text-[#9AA6D6]">
                  Layer A • Entity Resolution
                </span>
                {pipeline.layerAProgress === 100 ? (
                  <div className="w-5 h-5 rounded-full bg-[#2DD4A3]/20 text-[#2DD4A3] flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                ) : (
                  <span className="text-xs font-mono-code text-[#22D3EE]">{pipeline.layerAProgress}%</span>
                )}
              </div>
              <p className="text-xs font-medium text-[#E8ECFF] mb-2.5">
                Fuzzy Name &amp; Tribal Transliteration Diff
              </p>
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-[#0E1530] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#5B6CFF] to-[#22D3EE] rounded-full transition-all duration-300"
                  style={{ width: `${pipeline.layerAProgress}%` }}
                />
              </div>
            </div>

            {/* Step 2: Layer B */}
            <div className={`p-4 rounded-2xl border transition-all ${
              pipeline.activeStep === 2 
                ? 'bg-[#141C3D] border-[#22D3EE] shadow-lg shadow-[#22D3EE]/10' 
                : 'bg-[#070B1A]/60 border-[#9AA6D6]/15'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono-code uppercase text-[#9AA6D6]">
                  Layer B • Deterministic Rules
                </span>
                {pipeline.layerBProgress === 100 ? (
                  <div className="w-5 h-5 rounded-full bg-[#2DD4A3]/20 text-[#2DD4A3] flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                ) : (
                  <span className="text-xs font-mono-code text-[#22D3EE]">{pipeline.layerBProgress}%</span>
                )}
              </div>
              <p className="text-xs font-medium text-[#E8ECFF] mb-2.5">
                FIN-001 (Sibling Clearance) &amp; FIN-002 (Convergence)
              </p>
              <div className="w-full h-1.5 bg-[#0E1530] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#22D3EE] to-[#FFB020] rounded-full transition-all duration-300"
                  style={{ width: `${pipeline.layerBProgress}%` }}
                />
              </div>
            </div>

            {/* Step 3: Layer C */}
            <div className={`p-4 rounded-2xl border transition-all ${
              pipeline.activeStep === 3 
                ? 'bg-[#141C3D] border-[#22D3EE] shadow-lg shadow-[#22D3EE]/10' 
                : 'bg-[#070B1A]/60 border-[#9AA6D6]/15'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono-code uppercase text-[#9AA6D6]">
                  Layer C • Explainability Trace
                </span>
                {pipeline.layerCProgress === 100 ? (
                  <div className="w-5 h-5 rounded-full bg-[#2DD4A3]/20 text-[#2DD4A3] flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                ) : (
                  <span className="text-xs font-mono-code text-[#22D3EE]">{pipeline.layerCProgress}%</span>
                )}
              </div>
              <p className="text-xs font-medium text-[#E8ECFF] mb-2.5">
                Gemini 3.8 Evidence Synthesis (Non-Verdict)
              </p>
              <div className="w-full h-1.5 bg-[#0E1530] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#FFB020] to-[#2DD4A3] rounded-full transition-all duration-300"
                  style={{ width: `${pipeline.layerCProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Count-Up */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Scanned */}
        <div className="p-5 rounded-2xl bg-[#0E1530] border border-[#9AA6D6]/15 space-y-2 hover:border-[#5B6CFF]/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-code text-[#5F6B99] uppercase tracking-wider">
              Applications Scanned
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#5B6CFF]/15 text-[#5B6CFF] flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-bold text-3xl text-[#E8ECFF]">
            {counts.totalScanned.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#9AA6D6]">
            PFMS Batch CG-2026-Q1 across 8 colleges
          </p>
        </div>

        {/* Typos Auto-Resolved */}
        <div className="p-5 rounded-2xl bg-[#0E1530] border border-[#9AA6D6]/15 space-y-2 hover:border-[#2DD4A3]/40 transition-colors cursor-pointer"
             onClick={() => setCurrentScreen('entity_resolution')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-code text-[#2DD4A3] uppercase tracking-wider">
              Typos Auto-Resolved
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#2DD4A3]/15 text-[#2DD4A3] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-bold text-3xl text-[#2DD4A3]">
            {counts.typosResolved}
          </div>
          <p className="text-[11px] text-[#9AA6D6]">
            Genuine tribal students saved from rejection
          </p>
        </div>

        {/* Legitimate Siblings Cleared */}
        <div className="p-5 rounded-2xl bg-[#0E1530] border border-[#9AA6D6]/15 space-y-2 hover:border-[#22D3EE]/40 transition-colors cursor-pointer"
             onClick={() => setCurrentScreen('false_positive_proof')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-code text-[#22D3EE] uppercase tracking-wider">
              Shared Accounts Cleared
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#22D3EE]/15 text-[#22D3EE] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-bold text-3xl text-[#22D3EE]">
            {counts.siblingsCleared}
          </div>
          <p className="text-[11px] text-[#9AA6D6]">
            Rule FIN-001: Verified single households
          </p>
        </div>

        {/* Network Surfaced */}
        <div className="p-5 rounded-2xl bg-[#0E1530] border border-[#FF4D6D]/30 space-y-2 hover:border-[#FF4D6D] transition-colors cursor-pointer relative overflow-hidden"
             onClick={() => setCurrentScreen('case_file')}>
          <div className="absolute top-0 right-0 w-2 h-full bg-[#FF4D6D]" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-code text-[#FF4D6D] uppercase tracking-wider">
              Network Under Review
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FF4D6D]/15 text-[#FF4D6D] flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-bold text-3xl text-[#FF4D6D]">
            {counts.networkSurfaced} Syndicate
          </div>
          <p className="text-[11px] text-[#9AA6D6]">
            8 apps across 3 colleges • 0 shared households
          </p>
        </div>
      </div>

      {/* Urgent Action Card: "Needs Officer Review" Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#141C3D] via-[#0E1530] to-[#141C3D] border border-[#FF4D6D]/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FF4D6D]/15 border border-[#FF4D6D]/30 flex items-center justify-center text-[#FF4D6D] shrink-0 mt-0.5">
            <GitFork className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-code uppercase px-2 py-0.5 rounded bg-[#FF4D6D]/20 text-[#FF4D6D] font-semibold border border-[#FF4D6D]/30">
                Action Required
              </span>
              <h3 className="font-heading font-bold text-base text-[#E8ECFF]">
                Case File #SCH-CG-08 • Rule FIN-002 Triggered
              </h3>
            </div>
            <p className="text-xs text-[#9AA6D6] leading-relaxed max-w-2xl">
              {fin002.evidenceStatement}. Relational intelligence detected multi-college convergence without common domicile. Direct PFMS treasury disbursement is intercepted.
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentScreen('case_file')}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FF4D6D] hover:bg-[#ff3357] text-white text-xs font-heading font-semibold shadow-lg shadow-[#FF4D6D]/20 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
        >
          <span>Examine Case File Graph</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Outcome Breakdown Donut */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0E1530] border border-[#9AA6D6]/15 space-y-4">
          <div>
            <h3 className="font-heading font-semibold text-base text-[#E8ECFF]">
              Pre-Disbursement Outcome Breakdown
            </h3>
            <p className="text-xs text-[#5F6B99]">
              Reconciliation breakdown of 1,000 applications
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={outcomeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {outcomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#070B1A" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      return (
                        <div className="bg-[#141C3D] border border-[#9AA6D6]/20 p-2.5 rounded-lg text-xs font-mono-code shadow-xl">
                          <p className="text-[#E8ECFF] font-semibold">{data.name}</p>
                          <p className="text-[#22D3EE]">{data.value} applications ({((Number(data.value) / 1000) * 100).toFixed(1)}%)</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend items */}
          <div className="space-y-2 pt-2 border-t border-[#9AA6D6]/10 text-xs">
            {outcomeData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#9AA6D6]">{item.name}</span>
                </div>
                <span className="font-mono-code text-[#E8ECFF] font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Applications by District Area Chart */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0E1530] border border-[#9AA6D6]/15 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-semibold text-base text-[#E8ECFF]">
                Applications Distribution by District
              </h3>
              <p className="text-xs text-[#5F6B99]">
                Chhattisgarh administrative districts • Total vs Resolved vs Flagged
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono-code">
              <span className="flex items-center gap-1.5 text-[#5B6CFF]">
                <span className="w-2.5 h-2.5 rounded bg-[#5B6CFF]" /> Total
              </span>
              <span className="flex items-center gap-1.5 text-[#2DD4A3]">
                <span className="w-2.5 h-2.5 rounded bg-[#2DD4A3]" /> Typos Saved
              </span>
              <span className="flex items-center gap-1.5 text-[#FF4D6D]">
                <span className="w-2.5 h-2.5 rounded bg-[#FF4D6D]" /> Flagged
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={districtData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5B6CFF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#5B6CFF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2DD4A3" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2DD4A3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,255,0.06)" />
                <XAxis dataKey="district" stroke="#5F6B99" fontSize={11} tickLine={false} />
                <YAxis stroke="#5F6B99" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#141C3D', borderColor: 'rgba(148,163,255,0.2)', borderRadius: '8px' }}
                  labelStyle={{ color: '#E8ECFF', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="total" stroke="#5B6CFF" fillOpacity={1} fill="url(#colorTotal)" />
                <Area type="monotone" dataKey="resolved" stroke="#2DD4A3" fillOpacity={1} fill="url(#colorResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3.5 rounded-xl bg-[#070B1A] border border-[#9AA6D6]/10 text-xs text-[#9AA6D6] flex items-center justify-between">
            <span>Tribal Districts Bastar &amp; Surguja Reconciliation Efficiency:</span>
            <span className="font-mono-code text-[#2DD4A3] font-semibold">100% Typo Preservation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

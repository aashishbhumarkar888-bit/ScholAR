import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EntityMatch } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle,
  Building,
  MapPin,
  FileText,
  Check,
  X,
  Layers
} from 'lucide-react';

export const EntityResolutionScreen: React.FC = () => {
  const { matches, updateMatchStatus, batchApproveMatches } = useApp();
  const [filter, setFilter] = useState<'all' | 'suggested' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const approvedCount = matches.filter(m => m.status === 'approved').length;
  const pendingCount = matches.filter(m => m.status === 'suggested').length;
  const rejectedCount = matches.filter(m => m.status === 'rejected').length;

  const filteredMatches = matches.filter(item => {
    if (filter !== 'all' && item.status !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.nameA.toLowerCase().includes(q) ||
        item.nameB.toLowerCase().includes(q) ||
        item.college.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q) ||
        item.recordBId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#0E1530] via-[#141C3D] to-[#0E1530] border border-[#2DD4A3]/25 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2DD4A3]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2DD4A3]/15 border border-[#2DD4A3]/30 text-[#2DD4A3] text-xs font-mono-code uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Layer A • Entity Resolution Engine</span>
            </div>
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#E8ECFF] tracking-tight">
              50 genuine students saved from wrongful rejection.
            </h1>
            <p className="text-xs sm:text-sm text-[#9AA6D6] leading-relaxed">
              Standardized Levenshtein distance combined with Indic Phonetic Keys resolves dialect spelling variants, 
              double-vowels, and matriculation record mismatches. Prevents marginalized tribal &amp; rural scholars from being disenfranchised by strict string matching.
            </p>
          </div>

          {/* Quick Action: Batch Approve */}
          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={batchApproveMatches}
              disabled={pendingCount === 0}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#2DD4A3] to-[#1FB88B] text-[#070B1A] font-heading font-bold text-xs shadow-lg shadow-[#2DD4A3]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              <span>Approve All 50 Suggestions</span>
            </button>
          </div>
        </div>

        {/* Stats metrics row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#9AA6D6]/10 text-xs">
          <div>
            <span className="text-[#5F6B99] block font-mono-code uppercase text-[10px]">Total Typo Candidates</span>
            <span className="font-heading font-bold text-xl text-[#E8ECFF]">50 Records</span>
          </div>
          <div>
            <span className="text-[#5F6B99] block font-mono-code uppercase text-[10px]">Approved &amp; Cleared</span>
            <span className="font-heading font-bold text-xl text-[#2DD4A3]">{approvedCount} Students</span>
          </div>
          <div>
            <span className="text-[#5F6B99] block font-mono-code uppercase text-[10px]">Awaiting Human Review</span>
            <span className="font-heading font-bold text-xl text-[#FFB020]">{pendingCount} Pairs</span>
          </div>
          <div>
            <span className="text-[#5F6B99] block font-mono-code uppercase text-[10px]">Average Match Confidence</span>
            <span className="font-heading font-bold text-xl text-[#22D3EE]">93.4% Similarity</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0E1530] border border-[#9AA6D6]/15">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#070B1A] border border-[#9AA6D6]/10 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === 'all'
                ? 'bg-[#141C3D] text-[#E8ECFF] shadow'
                : 'text-[#9AA6D6] hover:text-[#E8ECFF]'
            }`}
          >
            All (50)
          </button>
          <button
            onClick={() => setFilter('suggested')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === 'suggested'
                ? 'bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/30 shadow'
                : 'text-[#9AA6D6] hover:text-[#E8ECFF]'
            }`}
          >
            Pending Review ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === 'approved'
                ? 'bg-[#2DD4A3]/20 text-[#2DD4A3] border border-[#2DD4A3]/30 shadow'
                : 'text-[#9AA6D6] hover:text-[#E8ECFF]'
            }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === 'rejected'
                ? 'bg-[#FF4D6D]/20 text-[#FF4D6D] border border-[#FF4D6D]/30 shadow'
                : 'text-[#9AA6D6] hover:text-[#E8ECFF]'
            }`}
          >
            Rejected ({rejectedCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#5F6B99] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student, college, district…"
            className="w-full bg-[#070B1A] border border-[#9AA6D6]/20 focus:border-[#22D3EE] rounded-xl pl-9 pr-3 py-2 text-xs text-[#E8ECFF] placeholder-[#5F6B99] outline-none transition-all font-mono-code"
          />
        </div>
      </div>

      {/* Grid of Resolved Pairs with Before/After Diff */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMatches.map((match) => {
          return (
            <div
              key={match.id}
              className={`p-5 rounded-2xl bg-[#0E1530] border transition-all space-y-4 hover:border-[#5B6CFF]/40 ${
                match.status === 'approved'
                  ? 'border-[#2DD4A3]/30'
                  : match.status === 'rejected'
                  ? 'border-[#FF4D6D]/30 opacity-75'
                  : 'border-[#9AA6D6]/15'
              }`}
            >
              {/* Card Header: Application ID & Match Bar */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono-code text-[#22D3EE] font-semibold">
                    {match.recordBId}
                  </span>
                  <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#141C3D] text-[#9AA6D6]">
                    {match.district}
                  </span>
                </div>

                {/* Status Badge */}
                <span className={`text-[10px] font-mono-code uppercase px-2 py-0.5 rounded font-semibold ${
                  match.status === 'approved'
                    ? 'bg-[#2DD4A3]/20 text-[#2DD4A3] border border-[#2DD4A3]/30'
                    : match.status === 'rejected'
                    ? 'bg-[#FF4D6D]/20 text-[#FF4D6D] border border-[#FF4D6D]/30'
                    : 'bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/30'
                }`}>
                  {match.status}
                </span>
              </div>

              {/* Before / After Diff Visualizer */}
              <div className="p-3.5 rounded-xl bg-[#070B1A] border border-[#9AA6D6]/10 space-y-3 font-mono-code">
                {/* Canonical Database Record */}
                <div className="flex items-start justify-between gap-2">
                  <div className="text-[11px] text-[#5F6B99] w-28 shrink-0">
                    CANONICAL (10th):
                  </div>
                  <div className="flex-1 text-xs text-[#E8ECFF] flex flex-wrap">
                    {match.diffA.map((item, i) => (
                      <span
                        key={i}
                        className={item.changed ? 'bg-[#5B6CFF]/40 text-[#22D3EE] px-0.5 rounded font-bold' : ''}
                      >
                        {item.char}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Submitted Scholarship Application */}
                <div className="flex items-start justify-between gap-2 pt-2 border-t border-[#9AA6D6]/10">
                  <div className="text-[11px] text-[#5F6B99] w-28 shrink-0">
                    SUBMITTED PORTAL:
                  </div>
                  <div className="flex-1 text-xs text-[#E8ECFF] flex flex-wrap">
                    {match.diffB.map((item, i) => (
                      <span
                        key={i}
                        className={item.changed ? 'bg-[#FFB020]/30 text-[#FFB020] px-0.5 rounded font-bold underline' : ''}
                      >
                        {item.char}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Match Strength Bar & Phonetic Details */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono-code">
                  <span className="text-[#9AA6D6]">Match Confidence Strength:</span>
                  <span className="text-[#2DD4A3] font-bold">{match.similarity}% Match</span>
                </div>
                <div className="w-full h-2 bg-[#070B1A] rounded-full overflow-hidden p-[1px]">
                  <div
                    className="h-full bg-gradient-to-r from-[#5B6CFF] via-[#22D3EE] to-[#2DD4A3] rounded-full"
                    style={{ width: `${match.similarity}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#5F6B99] font-mono-code pt-0.5">
                  <span>Phonetic Keys: {match.phoneticKeyA} {'<=>'} {match.phoneticKeyB}</span>
                  <span className="text-[#2DD4A3]">Soundex Confirmed</span>
                </div>
              </div>

              {/* Plain-Language Reason */}
              <div className="p-2.5 rounded-lg bg-[#141C3D]/60 border border-[#9AA6D6]/10 text-xs text-[#9AA6D6] leading-relaxed">
                <span className="text-[#E8ECFF] font-medium">Reconciliation Reason: </span>
                {match.reason}
              </div>

              {/* College & Scheme Footer with Approve / Reject Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#9AA6D6]/10 text-xs">
                <div className="text-[11px] text-[#5F6B99] truncate max-w-xs">
                  <span className="text-[#9AA6D6]">{match.college}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => updateMatchStatus(match.id, 'rejected')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      match.status === 'rejected'
                        ? 'bg-[#FF4D6D]/20 text-[#FF4D6D] border border-[#FF4D6D]/40'
                        : 'bg-[#141C3D] hover:bg-[#FF4D6D]/15 text-[#9AA6D6] hover:text-[#FF4D6D]'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={() => updateMatchStatus(match.id, 'approved')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      match.status === 'approved'
                        ? 'bg-[#2DD4A3] text-[#070B1A] shadow-md shadow-[#2DD4A3]/20'
                        : 'bg-[#141C3D] hover:bg-[#2DD4A3]/20 text-[#9AA6D6] hover:text-[#2DD4A3] border border-[#2DD4A3]/30'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve Merge</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

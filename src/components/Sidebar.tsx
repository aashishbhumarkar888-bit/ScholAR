import React from 'react';
import { useApp } from '../context/AppContext';
import { ScreenId } from '../types';
import { 
  LayoutDashboard, 
  UserCheck2, 
  GitFork, 
  ShieldCheck, 
  ScrollText, 
  AlertTriangle,
  CheckCircle2,
  Lock,
  Layers
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentScreen, setCurrentScreen, matches, ruleResults } = useApp();

  const approvedMatchesCount = matches.filter(m => m.status === 'approved').length;
  const pendingMatchesCount = matches.filter(m => m.status === 'suggested').length;

  const navItems: {
    id: ScreenId;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: {
      text: string;
      color: 'emerald' | 'amber' | 'crimson' | 'indigo';
    };
  }[] = [
    {
      id: 'command_center',
      label: 'Command Center',
      description: 'Reconciliation Pipeline & KPIs',
      icon: LayoutDashboard,
    },
    {
      id: 'entity_resolution',
      label: 'Entity Resolution',
      description: 'Tribal Name Typo Reconciliation',
      icon: UserCheck2,
      badge: {
        text: `${pendingMatchesCount > 0 ? pendingMatchesCount + ' To Review' : '50 Saved'}`,
        color: pendingMatchesCount > 0 ? 'amber' : 'emerald',
      },
    },
    {
      id: 'case_file',
      label: 'Case File #SCH-CG-08',
      description: 'React Flow Relational Syndicate',
      icon: GitFork,
      badge: {
        text: 'Needs Review',
        color: 'crimson',
      },
    },
    {
      id: 'false_positive_proof',
      label: 'False-Positive Proof',
      description: 'Sibling Exception Safeguard',
      icon: ShieldCheck,
      badge: {
        text: '40 Cleared',
        color: 'emerald',
      },
    },
    {
      id: 'audit_ledger',
      label: 'Audit Ledger',
      description: 'Tamper-Evident SHA-256 Log',
      icon: ScrollText,
      badge: {
        text: 'Immutable',
        color: 'indigo',
      },
    },
  ];

  return (
    <aside className="w-64 bg-[#0E1530] border-r border-[#9AA6D6]/10 flex flex-col justify-between p-4 shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* Navigation list */}
        <div className="space-y-1">
          <p className="text-[11px] font-mono-code uppercase tracking-wider text-[#5F6B99] px-3 mb-2">
            Investigation Modules
          </p>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 relative group ${
                    isActive
                      ? 'bg-[#141C3D] text-[#E8ECFF] border border-[#5B6CFF]/40 shadow-lg shadow-[#5B6CFF]/10'
                      : 'text-[#9AA6D6] hover:text-[#E8ECFF] hover:bg-[#141C3D]/50 border border-transparent'
                  }`}
                >
                  {/* Active Indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-[#5B6CFF] to-[#22D3EE] rounded-r" />
                  )}

                  <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                    isActive
                      ? 'bg-[#5B6CFF]/20 text-[#22D3EE]'
                      : 'bg-[#070B1A] text-[#5F6B99] group-hover:text-[#9AA6D6]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-heading font-medium text-sm truncate">
                        {item.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5F6B99] truncate mt-0.5">
                      {item.description}
                    </p>

                    {item.badge && (
                      <div className="mt-1.5">
                        <span className={`inline-flex items-center text-[10px] font-mono-code px-1.5 py-0.5 rounded ${
                          item.badge.color === 'emerald'
                            ? 'bg-[#2DD4A3]/15 text-[#2DD4A3] border border-[#2DD4A3]/30'
                            : item.badge.color === 'amber'
                            ? 'bg-[#FFB020]/15 text-[#FFB020] border border-[#FFB020]/30'
                            : item.badge.color === 'crimson'
                            ? 'bg-[#FF4D6D]/15 text-[#FF4D6D] border border-[#FF4D6D]/30'
                            : 'bg-[#5B6CFF]/15 text-[#5B6CFF] border border-[#5B6CFF]/30'
                        }`}>
                          {item.badge.text}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Engine Pipeline Architecture Card */}
        <div className="p-3.5 rounded-xl bg-[#070B1A]/80 border border-[#9AA6D6]/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#E8ECFF]">
            <Layers className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span>3-Layer Architecture</span>
          </div>
          <div className="space-y-1.5 text-[11px] font-mono-code">
            <div className="flex items-center justify-between text-[#9AA6D6]">
              <span>Layer A (Entity Res)</span>
              <span className="text-[#2DD4A3]">50 Resolved</span>
            </div>
            <div className="flex items-center justify-between text-[#9AA6D6]">
              <span>Layer B (Rules Engine)</span>
              <span className="text-[#22D3EE]">3 Active</span>
            </div>
            <div className="flex items-center justify-between text-[#9AA6D6]">
              <span>Layer C (Explainability)</span>
              <span className="text-[#FFB020]">Gemini 3.8</span>
            </div>
          </div>
        </div>
      </div>

      {/* PFMS Pre-Disbursement Gateway Status */}
      <div className="p-3.5 rounded-xl bg-gradient-to-b from-[#141C3D] to-[#070B1A] border border-[#9AA6D6]/15 space-y-2.5 mt-6">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono-code text-[#5F6B99] uppercase tracking-wider">
            PFMS Sidecar Status
          </span>
          <span className="w-2 h-2 rounded-full bg-[#2DD4A3] animate-pulse" />
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-[#E8ECFF]">
            Treasury Gateway: Intercept Mode
          </p>
          <p className="text-[10px] text-[#9AA6D6] leading-tight">
            Holding 8 flagged transactions awaiting Human Officer cryptographic sign-off.
          </p>
        </div>

        <div className="pt-2 border-t border-[#9AA6D6]/10 flex items-center justify-between text-[11px] font-mono-code">
          <span className="text-[#5F6B99]">Target Payout:</span>
          <span className="text-[#E8ECFF] font-semibold">₹3,94,80,000</span>
        </div>
      </div>
    </aside>
  );
};

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AuditEntry } from '../types';
import { 
  ShieldAlert, 
  FileCheck, 
  HelpCircle, 
  Lock, 
  Key, 
  CheckCircle, 
  X, 
  AlertCircle,
  Hash
} from 'lucide-react';
import { computeSHA256, truncateHash } from '../lib/crypto';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAction?: 'ESCALATE_VIGILANCE' | 'CLEAR_CASE' | 'REQUEST_DOCUMENTS';
  targetCaseId?: string;
  targetDescription?: string;
  onSuccess?: (entry: AuditEntry) => void;
}

export const ActionModal: React.FC<ActionModalProps> = ({
  isOpen,
  onClose,
  defaultAction = 'ESCALATE_VIGILANCE',
  targetCaseId = 'CASE-FIN002-RING-2026',
  targetDescription = '8 scholarship applications across 3 colleges sharing 2 bank accounts with 0 shared households',
  onSuccess,
}) => {
  const { appendAuditEntry, officer, auditLedger } = useApp();

  const [selectedAction, setSelectedAction] = useState<AuditEntry['action']>(defaultAction);
  const [writtenReason, setWrittenReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedHash, setCalculatedHash] = useState('');
  const [validationError, setValidationError] = useState('');

  // Previous hash in the ledger
  const prevEntry = auditLedger[auditLedger.length - 1];
  const prevHash = prevEntry ? prevEntry.hash : '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f';

  useEffect(() => {
    if (defaultAction) {
      setSelectedAction(defaultAction);
    }
  }, [defaultAction]);

  // Compute live hash preview when fields change
  useEffect(() => {
    async function updateHashPreview() {
      const payload = `${prevHash}|${auditLedger.length + 1}|${officer.id}|${selectedAction}|${targetCaseId}|${writtenReason}`;
      const hash = await computeSHA256(payload);
      setCalculatedHash(hash);
    }
    updateHashPreview();
  }, [prevHash, auditLedger.length, officer.id, selectedAction, targetCaseId, writtenReason]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!writtenReason.trim() || writtenReason.trim().length < 12) {
      setValidationError('Statutory Requirement: A detailed written official reason (minimum 12 characters) is mandatory before appending to the audit ledger.');
      return;
    }

    setIsSubmitting(true);
    try {
      const entry = await appendAuditEntry(
        selectedAction,
        targetCaseId,
        targetDescription,
        writtenReason.trim()
      );
      setIsSubmitting(false);
      onSuccess?.(entry);
      onClose();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const actionTemplates: Record<AuditEntry['action'], string[]> = {
    ESCALATE_VIGILANCE: [
      'Multi-institution convergence across 3 colleges and 2 financial destinations warrants immediate field inquiry by State Anti-Corruption Bureau.',
      'Suspected synthetic syndication detected. Issue summons to college nodal verification officers for physical ledger cross-verification.',
    ],
    REQUEST_DOCUMENTS: [
      'Disbursement intercepted. Mandate in-person biometric KYC at Raipur Divisional Treasury before release of funds.',
      'Instruct college principals to submit physical classroom attendance registers and signed matriculation certificate copies.',
    ],
    CLEAR_CASE: [
      'Affirmative exception verified. Joint family bank account exemption granted under PFMS guidelines.',
      'Manual field inspection confirmed legitimate local domicile and bonafide college enrollment.',
    ],
    APPROVE_TYPO_MERGE: [],
    BATCH_APPROVE_TYPOS: [],
    SYSTEM_INITIALIZE: [],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#0E1530] border border-[#5B6CFF]/30 rounded-2xl shadow-2xl overflow-hidden text-[#E8ECFF]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#9AA6D6]/10 flex items-center justify-between bg-[#141C3D]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5B6CFF]/20 border border-[#5B6CFF]/40 flex items-center justify-center text-[#22D3EE]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-lg text-[#E8ECFF]">
                Execute Statutory Officer Determination
              </h3>
              <p className="text-xs text-[#5F6B99]">
                PFMS Pre-Disbursement Audit • Officer: {officer.name} ({officer.id})
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-[#9AA6D6] hover:text-[#E8ECFF] hover:bg-[#141C3D]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Target case summary */}
          <div className="p-3.5 rounded-xl bg-[#070B1A] border border-[#9AA6D6]/15 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono-code text-[#5F6B99]">
              <span>TARGET CASE FILE:</span>
              <span className="text-[#22D3EE] font-semibold">{targetCaseId}</span>
            </div>
            <p className="text-xs text-[#E8ECFF] leading-relaxed">
              {targetDescription}
            </p>
          </div>

          {/* Action selection */}
          <div className="space-y-2">
            <label className="block text-xs font-mono-code uppercase tracking-wider text-[#9AA6D6]">
              Select Officer Action (Irrevocable)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Escalate */}
              <button
                type="button"
                onClick={() => {
                  setSelectedAction('ESCALATE_VIGILANCE');
                  setValidationError('');
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedAction === 'ESCALATE_VIGILANCE'
                    ? 'bg-[#FF4D6D]/15 border-[#FF4D6D] text-[#E8ECFF] shadow-lg shadow-[#FF4D6D]/10'
                    : 'bg-[#141C3D]/60 border-[#9AA6D6]/15 text-[#9AA6D6] hover:border-[#9AA6D6]/30'
                }`}
              >
                <ShieldAlert className={`w-4 h-4 mb-2 ${selectedAction === 'ESCALATE_VIGILANCE' ? 'text-[#FF4D6D]' : 'text-[#9AA6D6]'}`} />
                <div className="font-heading font-semibold text-xs text-[#E8ECFF]">
                  Escalate to Vigilance
                </div>
                <div className="text-[10px] text-[#5F6B99] mt-1 leading-snug">
                  Block PFMS disbursement & transfer to State Anti-Corruption Bureau.
                </div>
              </button>

              {/* Request Documents */}
              <button
                type="button"
                onClick={() => {
                  setSelectedAction('REQUEST_DOCUMENTS');
                  setValidationError('');
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedAction === 'REQUEST_DOCUMENTS'
                    ? 'bg-[#FFB020]/15 border-[#FFB020] text-[#E8ECFF] shadow-lg shadow-[#FFB020]/10'
                    : 'bg-[#141C3D]/60 border-[#9AA6D6]/15 text-[#9AA6D6] hover:border-[#9AA6D6]/30'
                }`}
              >
                <HelpCircle className={`w-4 h-4 mb-2 ${selectedAction === 'REQUEST_DOCUMENTS' ? 'text-[#FFB020]' : 'text-[#9AA6D6]'}`} />
                <div className="font-heading font-semibold text-xs text-[#E8ECFF]">
                  Request In-Person KYC
                </div>
                <div className="text-[10px] text-[#5F6B99] mt-1 leading-snug">
                  Hold transaction pending physical biometric and attendance audit.
                </div>
              </button>

              {/* Clear Case */}
              <button
                type="button"
                onClick={() => {
                  setSelectedAction('CLEAR_CASE');
                  setValidationError('');
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedAction === 'CLEAR_CASE'
                    ? 'bg-[#2DD4A3]/15 border-[#2DD4A3] text-[#E8ECFF] shadow-lg shadow-[#2DD4A3]/10'
                    : 'bg-[#141C3D]/60 border-[#9AA6D6]/15 text-[#9AA6D6] hover:border-[#9AA6D6]/30'
                }`}
              >
                <CheckCircle className={`w-4 h-4 mb-2 ${selectedAction === 'CLEAR_CASE' ? 'text-[#2DD4A3]' : 'text-[#9AA6D6]'}`} />
                <div className="font-heading font-semibold text-xs text-[#E8ECFF]">
                  Authorize & Clear
                </div>
                <div className="text-[10px] text-[#5F6B99] mt-1 leading-snug">
                  Confirm legitimacy and release funds to PFMS Treasury batch.
                </div>
              </button>
            </div>
          </div>

          {/* Written Reason (Mandatory) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono-code uppercase tracking-wider text-[#9AA6D6]">
                Written Official Reason <span className="text-[#FF4D6D]">*Mandatory</span>
              </label>
              <span className="text-[11px] font-mono-code text-[#5F6B99]">
                {writtenReason.length} chars (min 12)
              </span>
            </div>

            <textarea
              value={writtenReason}
              onChange={(e) => {
                setWrittenReason(e.target.value);
                setValidationError('');
              }}
              rows={3}
              placeholder="Provide statutory justification for official ledger entry..."
              className="w-full bg-[#070B1A] border border-[#9AA6D6]/20 focus:border-[#22D3EE] rounded-xl p-3 text-xs text-[#E8ECFF] placeholder-[#5F6B99] outline-none transition-all font-mono-code"
            />

            {/* Quick reason templates */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] text-[#5F6B99] block">Official wording presets:</span>
              <div className="flex flex-wrap gap-1.5">
                {(actionTemplates[selectedAction] || []).map((t, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setWrittenReason(t);
                      setValidationError('');
                    }}
                    className="text-[10px] text-[#9AA6D6] bg-[#141C3D] hover:bg-[#1C274E] px-2.5 py-1 rounded-lg border border-[#9AA6D6]/10 text-left transition-colors"
                  >
                    + {t.slice(0, 55)}…
                  </button>
                ))}
              </div>
            </div>

            {validationError && (
              <div className="flex items-center gap-1.5 text-xs text-[#FF4D6D] pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}
          </div>

          {/* Cryptographic SHA-256 Chaining Preview */}
          <div className="p-3 rounded-xl bg-[#070B1A]/80 border border-[#5B6CFF]/20 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono-code text-[#5F6B99]">
              <span className="flex items-center gap-1.5 text-[#22D3EE]">
                <Key className="w-3.5 h-3.5" />
                Cryptographic Chaining Preview
              </span>
              <span>Sequence #{auditLedger.length + 1}</span>
            </div>

            <div className="space-y-1 font-mono-code text-[10px]">
              <div className="flex items-center justify-between text-[#9AA6D6]">
                <span>Previous Block Hash:</span>
                <span className="text-[#5F6B99]">{truncateHash(prevHash, 10, 8)}</span>
              </div>
              <div className="flex items-center justify-between text-[#9AA6D6]">
                <span>Next Computed SHA-256:</span>
                <span className="text-[#2DD4A3] font-semibold">{truncateHash(calculatedHash, 12, 10)}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#9AA6D6]/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-[#9AA6D6]/20 text-[#9AA6D6] hover:text-[#E8ECFF] text-xs font-medium transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || writtenReason.trim().length < 12}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg transition-all ${
                selectedAction === 'ESCALATE_VIGILANCE'
                  ? 'bg-gradient-to-r from-[#FF4D6D] to-[#E63956] hover:shadow-[#FF4D6D]/20'
                  : selectedAction === 'CLEAR_CASE'
                  ? 'bg-gradient-to-r from-[#2DD4A3] to-[#1FB88B] hover:shadow-[#2DD4A3]/20'
                  : 'bg-gradient-to-r from-[#5B6CFF] to-[#22D3EE] hover:shadow-[#5B6CFF]/20'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Signing SHA-256 Block…' : 'Sign & Append to Immutable Ledger'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

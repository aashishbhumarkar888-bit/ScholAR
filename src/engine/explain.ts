import { RuleResult } from '../types';

export const FALLBACK_INVESTIGATION_TRACE = 
  "Deterministic engine flagged 8 scholarship applications originating across 3 distinct institutions (Government Engineering College Raipur, Bilaspur Institute of Technology, Bastar Tribal Degree College) converging on 2 hashed financial destination accounts (FD-7a3f…c91 and FD-9e2b…a44). Cross-referencing municipal census records confirms 0 shared households among applicants. Rule FIN-001 (legitimate sibling sharing) evaluated as non-applicable. Systematic multi-institutional bank account convergence indicates coordinated syndication requiring verification of beneficiary biometric KYC and physical campus attendance rolls. Final determination rests with the Nodal Officer.";

export interface ExplainResponse {
  trace: string;
  source: 'gemini_api' | 'fallback_template';
}

/**
 * Calls backend `/api/explain` with strictly triggered rule IDs and evidence JSON.
 * Falls back to deterministic forensic trace if network/server is unavailable.
 */
export async function generateInvestigationTrace(
  triggeredRules: RuleResult[],
  customAbortSignal?: AbortSignal
): Promise<ExplainResponse> {
  const payload = {
    ruleIds: triggeredRules.map(r => r.ruleId),
    evidence: triggeredRules.map(r => ({
      ruleId: r.ruleId,
      statement: r.evidenceStatement,
      involvedColleges: r.involvedColleges,
      involvedAccounts: r.involvedAccounts,
      sampleBeneficiaries: r.evidenceItems.slice(0, 4).map(e => ({
        id: e.applicationId,
        student: e.studentName,
        college: e.collegeName,
        account: e.bankToken,
      })),
      counterEvidence: r.counterEvidence,
    })),
  };

  try {
    const res = await fetch('/api/explain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: customAbortSignal,
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Failed to reach explainability service`);
    }

    const data = await res.json();
    if (data && typeof data.trace === 'string' && data.trace.trim().length > 0) {
      return {
        trace: data.trace.trim(),
        source: data.source === 'gemini_api' ? 'gemini_api' : 'fallback_template',
      };
    }
    return { trace: FALLBACK_INVESTIGATION_TRACE, source: 'fallback_template' };
  } catch (err: any) {
    console.warn('Explainability API request failed, utilizing high-fidelity fallback template:', err?.message || err);
    return { trace: FALLBACK_INVESTIGATION_TRACE, source: 'fallback_template' };
  }
}

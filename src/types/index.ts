export type ApplicantCategory = 'SC' | 'ST' | 'OBC' | 'GEN';

export type RecordType = 
  | 'normal' 
  | 'typo_variant' 
  | 'sibling_cleared' 
  | 'scam_ring' 
  | 'camouflage';

export interface ApplicationRecord {
  id: string;
  studentName: string;
  canonicalName?: string;
  aadhaarHash: string;
  householdId: string;
  collegeId: string;
  collegeName: string;
  district: string;
  scheme: string;
  bankToken: string;
  ifscPrefix: string;
  docHash: string;
  amount: number;
  category: ApplicantCategory;
  recordType: RecordType;
  submittedAt: string;
  ringGroup?: string;
  notes?: string;
}

export interface EntityMatch {
  id: string;
  recordAId: string;
  recordBId: string;
  nameA: string;
  nameB: string;
  district: string;
  college: string;
  scheme: string;
  similarity: number; // 0-100
  phoneticKeyA: string;
  phoneticKeyB: string;
  reason: string;
  status: 'suggested' | 'approved' | 'rejected';
  resolvedAt?: string;
  diffA: { char: string; changed: boolean }[];
  diffB: { char: string; changed: boolean }[];
}

export interface RuleEvidenceItem {
  applicationId: string;
  studentName: string;
  collegeName: string;
  bankToken: string;
  householdId: string;
  scheme: string;
  amount: number;
}

export interface RuleResult {
  ruleId: 'FIN-001' | 'FIN-002' | 'DOC-001';
  ruleCode: string;
  ruleTitle: string;
  ruleDescription: string;
  status: 'CLEARED' | 'NEEDS_REVIEW' | 'PASSED';
  badgeLabel: string;
  badgeTone: 'emerald' | 'amber' | 'crimson' | 'muted';
  evidenceCount: number;
  evidenceStatement: string;
  evidenceItems: RuleEvidenceItem[];
  counterEvidence: string[];
  involvedColleges: string[];
  involvedAccounts: string[];
}

export interface AuditEntry {
  id: string;
  sequenceNumber: number;
  timestamp: string;
  officerId: string;
  officerName: string;
  officerRole: string;
  action: 'ESCALATE_VIGILANCE' | 'CLEAR_CASE' | 'REQUEST_DOCUMENTS' | 'APPROVE_TYPO_MERGE' | 'BATCH_APPROVE_TYPOS' | 'SYSTEM_INITIALIZE';
  targetCaseId: string;
  targetDescription: string;
  reason: string;
  prevHash: string;
  hash: string;
}

export type ScreenId = 
  | 'command_center' 
  | 'entity_resolution' 
  | 'case_file' 
  | 'false_positive_proof' 
  | 'audit_ledger';

export interface PipelineState {
  isRunning: boolean;
  activeStep: 0 | 1 | 2 | 3; // 0 = idle, 1 = Layer A, 2 = Layer B, 3 = Layer C, 4 = done
  layerAProgress: number; // 0-100
  layerBProgress: number; // 0-100
  layerCProgress: number; // 0-100
  completedAt?: string;
}

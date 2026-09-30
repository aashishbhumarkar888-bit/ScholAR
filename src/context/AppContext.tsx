import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  ApplicationRecord, 
  EntityMatch, 
  RuleResult, 
  AuditEntry, 
  ScreenId, 
  PipelineState 
} from '../types';
import { generateSyntheticDataset } from '../engine/seed';
import { runEntityResolution } from '../engine/entityResolution';
import { runRulesEngine } from '../engine/rules';
import { generateInvestigationTrace, FALLBACK_INVESTIGATION_TRACE } from '../engine/explain';
import { computeSHA256 } from '../lib/crypto';

interface AppContextType {
  records: ApplicationRecord[];
  matches: EntityMatch[];
  ruleResults: Record<'FIN-001' | 'FIN-002' | 'DOC-001', RuleResult>;
  currentScreen: ScreenId;
  setCurrentScreen: (screen: ScreenId) => void;
  pipeline: PipelineState;
  runReconciliationPipeline: () => Promise<void>;
  auditLedger: AuditEntry[];
  appendAuditEntry: (
    action: AuditEntry['action'],
    targetCaseId: string,
    targetDescription: string,
    reason: string
  ) => Promise<AuditEntry>;
  updateMatchStatus: (matchId: string, status: 'approved' | 'rejected') => Promise<void>;
  batchApproveMatches: () => Promise<void>;
  investigationTrace: string;
  traceSource: 'gemini_api' | 'fallback_template' | 'initial';
  refreshInvestigationTrace: () => Promise<void>;
  isDemoModeRunning: boolean;
  demoStep: number;
  demoMessage: string;
  startDemoMode: () => void;
  stopDemoMode: () => void;
  officer: {
    name: string;
    role: string;
    id: string;
    division: string;
  };
  highlightedBeneficiaryId: string | null;
  setHighlightedBeneficiaryId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const INITIAL_GENESIS_HASH = '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records] = useState<ApplicationRecord[]>(() => generateSyntheticDataset());
  const [matches, setMatches] = useState<EntityMatch[]>(() => runEntityResolution(records));
  const [ruleResults, setRuleResults] = useState(() => runRulesEngine(records));
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('command_center');
  const [highlightedBeneficiaryId, setHighlightedBeneficiaryId] = useState<string | null>(null);

  const [pipeline, setPipelineState] = useState<PipelineState>({
    isRunning: false,
    activeStep: 0,
    layerAProgress: 100,
    layerBProgress: 100,
    layerCProgress: 100,
    completedAt: '2026-03-30T09:00:00Z',
  });

  const [investigationTrace, setInvestigationTrace] = useState<string>(FALLBACK_INVESTIGATION_TRACE);
  const [traceSource, setTraceSource] = useState<'gemini_api' | 'fallback_template' | 'initial'>('initial');

  // Officer Profile
  const officer = {
    name: 'Alok Kashyap, IAS',
    role: 'Nodal Officer (Higher Education & Welfare)',
    id: 'CG-NODAL-RAI-0441',
    division: 'Raipur Division (HQ)',
  };

  // Tamper-Evident Audit Ledger
  const [auditLedger, setAuditLedger] = useState<AuditEntry[]>([]);

  // Initialize Genesis Entry
  useEffect(() => {
    async function initLedger() {
      const genesisTimestamp = '2026-03-30T08:30:00.000Z';
      const msg = `${INITIAL_GENESIS_HASH}:${genesisTimestamp}:SYSTEM:SYSTEM_INITIALIZE:ScholAR v2026.4 Production Build Initialized for Raipur Division`;
      const hash = await computeSHA256(msg);

      const genesisEntry: AuditEntry = {
        id: 'LEDGER-000001',
        sequenceNumber: 1,
        timestamp: genesisTimestamp,
        officerId: 'SYS-CORE-001',
        officerName: 'ScholAR Cryptographic Daemon',
        officerRole: 'System Core Engine',
        action: 'SYSTEM_INITIALIZE',
        targetCaseId: 'SYS-PFMS-CG-2026',
        targetDescription: 'ScholAR Pre-Disbursement Integrity Sidecar Initialized. Seed 20260401 loaded (1,000 applications).',
        reason: 'Authorized pre-disbursement batch reconciliation check initiated under PFMS Treasury Circular 42/2026.',
        prevHash: INITIAL_GENESIS_HASH,
        hash,
      };

      setAuditLedger([genesisEntry]);
    }
    initLedger();
  }, []);

  // Append new entry to immutable ledger
  const appendAuditEntry = useCallback(async (
    action: AuditEntry['action'],
    targetCaseId: string,
    targetDescription: string,
    reason: string
  ): Promise<AuditEntry> => {
    return new Promise((resolve) => {
      setAuditLedger((prevLedger) => {
        const lastEntry = prevLedger[prevLedger.length - 1];
        const prevHash = lastEntry ? lastEntry.hash : INITIAL_GENESIS_HASH;
        const seq = prevLedger.length + 1;
        const timestamp = new Date().toISOString();
        const entryId = `LEDGER-${String(seq).padStart(6, '0')}`;

        // Compute hash asynchronously
        const payloadToHash = `${prevHash}|${seq}|${timestamp}|${officer.id}|${action}|${targetCaseId}|${reason}`;
        
        computeSHA256(payloadToHash).then((newHash) => {
          const newEntry: AuditEntry = {
            id: entryId,
            sequenceNumber: seq,
            timestamp,
            officerId: officer.id,
            officerName: officer.name,
            officerRole: officer.role,
            action,
            targetCaseId,
            targetDescription,
            reason,
            prevHash,
            hash: newHash,
          };
          setAuditLedger([...prevLedger, newEntry]);
          resolve(newEntry);
        });

        return prevLedger;
      });
    });
  }, [officer]);

  // Update single entity match
  const updateMatchStatus = useCallback(async (matchId: string, status: 'approved' | 'rejected') => {
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status, resolvedAt: new Date().toISOString() } : m));
    const target = matches.find(m => m.id === matchId);
    if (target) {
      await appendAuditEntry(
        'APPROVE_TYPO_MERGE',
        target.id,
        `Entity Resolution: "${target.nameA}" <=> "${target.nameB}" (${status.toUpperCase()})`,
        `Nodal Officer verified tribal phonetic variation for ${target.college} (${status})`
      );
    }
  }, [matches, appendAuditEntry]);

  // Batch approve all matches
  const batchApproveMatches = useCallback(async () => {
    const now = new Date().toISOString();
    setMatches(prev => prev.map(m => ({ ...m, status: 'approved', resolvedAt: now })));
    await appendAuditEntry(
      'BATCH_APPROVE_TYPOS',
      'BATCH-TYPO-RESOLVE-50',
      'Batch Approval: 50 Genuine Student Transliteration / Typo Variants',
      'Affirmative determination by Nodal Officer to protect 50 rural/tribal scholars from wrongful portal rejection.'
    );
  }, [appendAuditEntry]);

  // Layer C trace generator
  const refreshInvestigationTrace = useCallback(async () => {
    const triggered = [ruleResults['FIN-002']];
    const res = await generateInvestigationTrace(triggered);
    setInvestigationTrace(res.trace);
    setTraceSource(res.source);
  }, [ruleResults]);

  // Animated 3-step pipeline runner
  const runReconciliationPipeline = useCallback(async () => {
    setPipelineState({
      isRunning: true,
      activeStep: 1,
      layerAProgress: 0,
      layerBProgress: 0,
      layerCProgress: 0,
    });

    // Step 1: Layer A (Entity Resolution)
    for (let p = 5; p <= 100; p += 15) {
      await new Promise(r => setTimeout(r, 60));
      setPipelineState(prev => ({ ...prev, layerAProgress: p }));
    }
    setPipelineState(prev => ({ ...prev, layerAProgress: 100, activeStep: 2 }));

    // Step 2: Layer B (Deterministic Rules)
    for (let p = 5; p <= 100; p += 20) {
      await new Promise(r => setTimeout(r, 70));
      setPipelineState(prev => ({ ...prev, layerBProgress: p }));
    }
    // Re-evaluate rules
    const freshRules = runRulesEngine(records);
    setRuleResults(freshRules);
    setPipelineState(prev => ({ ...prev, layerBProgress: 100, activeStep: 3 }));

    // Step 3: Layer C (Generative Explainability)
    for (let p = 10; p <= 90; p += 25) {
      await new Promise(r => setTimeout(r, 80));
      setPipelineState(prev => ({ ...prev, layerCProgress: p }));
    }
    await refreshInvestigationTrace();
    setPipelineState(prev => ({
      ...prev,
      layerCProgress: 100,
      activeStep: 0,
      isRunning: false,
      completedAt: new Date().toISOString(),
    }));
  }, [records, refreshInvestigationTrace]);

  // Demo Mode Orchestrator
  const [isDemoModeRunning, setIsDemoModeRunning] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [demoMessage, setDemoMessage] = useState('');
  const demoTimerRef = useRef<NodeJS.Timeout | null>(null);

  const stopDemoMode = useCallback(() => {
    setIsDemoModeRunning(false);
    setDemoStep(0);
    setDemoMessage('');
    if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
  }, []);

  const startDemoMode = useCallback(async () => {
    stopDemoMode();
    setIsDemoModeRunning(true);
    setDemoStep(1);
    setDemoMessage('Step 1 of 5: Initiating full pre-disbursement reconciliation pipeline...');
    setCurrentScreen('command_center');

    await runReconciliationPipeline();

    // After pipeline finishes, go to Step 2
    demoTimerRef.current = setTimeout(() => {
      setDemoStep(2);
      setDemoMessage('Step 2 of 5: Layer A Entity Resolution - 50 genuine tribal students saved from rejection.');
      setCurrentScreen('entity_resolution');

      demoTimerRef.current = setTimeout(() => {
        setDemoStep(3);
        setDemoMessage('Step 3 of 5: Layer B & C Case File - React Flow multi-college syndicate converging on 2 accounts.');
        setCurrentScreen('case_file');

        demoTimerRef.current = setTimeout(() => {
          setDemoStep(4);
          setDemoMessage('Step 4 of 5: False-Positive Proof - Why sibling accounts were correctly CLEARED.');
          setCurrentScreen('false_positive_proof');

          demoTimerRef.current = setTimeout(() => {
            setDemoStep(5);
            setDemoMessage('Step 5 of 5: Immutable Cryptographic Audit Ledger - Every officer action SHA-256 chained.');
            setCurrentScreen('audit_ledger');

            demoTimerRef.current = setTimeout(() => {
              setDemoMessage('Demo Walkthrough Complete! Human Nodal Officer retains sovereign oversight.');
              demoTimerRef.current = setTimeout(() => {
                stopDemoMode();
              }, 4000);
            }, 8000);
          }, 9000);
        }, 11000);
      }, 9000);
    }, 2000);
  }, [stopDemoMode, runReconciliationPipeline]);

  return (
    <AppContext.Provider
      value={{
        records,
        matches,
        ruleResults,
        currentScreen,
        setCurrentScreen,
        pipeline,
        runReconciliationPipeline,
        auditLedger,
        appendAuditEntry,
        updateMatchStatus,
        batchApproveMatches,
        investigationTrace,
        traceSource,
        refreshInvestigationTrace,
        isDemoModeRunning,
        demoStep,
        demoMessage,
        startDemoMode,
        stopDemoMode,
        officer,
        highlightedBeneficiaryId,
        setHighlightedBeneficiaryId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

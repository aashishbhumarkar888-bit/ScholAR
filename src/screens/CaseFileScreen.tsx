import React, { useState, useMemo, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  BackgroundVariant,
  Node, 
  Edge,
  MarkerType
} from '@xyflow/react';
import { 
  BeneficiaryNode, 
  CollegeNode, 
  BankDestinationNode 
} from '../components/case/CustomNodes';
import { TypewriterTrace } from '../components/TypewriterTrace';
import { ActionModal } from '../components/ActionModal';
import { 
  ShieldAlert, 
  Building2, 
  Landmark, 
  User, 
  Home, 
  CheckCircle, 
  AlertCircle, 
  X, 
  ExternalLink,
  Lock,
  ArrowRight,
  HelpCircle,
  FileCheck2,
  Table as TableIcon,
  Maximize2
} from 'lucide-react';
import { ApplicationRecord } from '../types';

const nodeTypes = {
  beneficiary: BeneficiaryNode,
  college: CollegeNode,
  bankDestination: BankDestinationNode,
};

export const CaseFileScreen: React.FC = () => {
  const { 
    records, 
    ruleResults, 
    investigationTrace, 
    traceSource, 
    refreshInvestigationTrace,
    setCurrentScreen,
    highlightedBeneficiaryId,
    setHighlightedBeneficiaryId
  } = useApp();

  const fin002 = ruleResults['FIN-002'];
  const flaggedApplications = fin002.evidenceItems;

  // Drawer state
  const [selectedNodeData, setSelectedNodeData] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Officer Action Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'ESCALATE_VIGILANCE' | 'CLEAR_CASE' | 'REQUEST_DOCUMENTS'>('ESCALATE_VIGILANCE');

  // Build React Flow graph elements
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // 1. Three College Nodes (Column 1: X = 50)
    const colleges = [
      { id: 'COL-GEC-RAI', name: 'Government Engineering College Raipur', district: 'Raipur', count: 3, y: 80 },
      { id: 'COL-BIT-BIL', name: 'Bilaspur Institute of Technology', district: 'Bilaspur', count: 3, y: 280 },
      { id: 'COL-BTD-BAS', name: 'Bastar Tribal Degree College Jagdalpur', district: 'Bastar', count: 2, y: 480 },
    ];

    colleges.forEach((col) => {
      nodes.push({
        id: col.id,
        type: 'college',
        position: { x: 40, y: col.y },
        data: {
          collegeId: col.id,
          collegeName: col.name,
          district: col.district,
          appCount: col.count,
        },
      });
    });

    // 2. Beneficiary Nodes (Column 2: X = 420)
    // 8 Ring applicants (4 to Bank 1, 4 to Bank 2)
    const ringApps = records.filter(r => r.recordType === 'scam_ring');

    ringApps.forEach((app, idx) => {
      const yPos = 30 + idx * 80;
      const isHighlighted = highlightedBeneficiaryId === app.id;

      nodes.push({
        id: app.id,
        type: 'beneficiary',
        position: { x: 400, y: yPos },
        data: {
          applicationId: app.id,
          studentName: app.studentName,
          householdId: app.householdId,
          collegeId: app.collegeId,
          collegeName: app.collegeName,
          bankToken: app.bankToken,
          amount: app.amount,
          scheme: app.scheme,
          category: app.category,
          docHash: app.docHash,
          isHighlighted,
        },
      });

      // Edge from College to Beneficiary
      edges.push({
        id: `e-${app.collegeId}-${app.id}`,
        source: app.collegeId,
        target: app.id,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#5B6CFF', strokeWidth: 1.5 },
      });

      // Edge from Beneficiary to Bank Destination
      const bankNodeId = app.bankToken === 'FD-7a3f…c91' ? 'BANK-DEST-1' : 'BANK-DEST-2';
      edges.push({
        id: `e-${app.id}-${bankNodeId}`,
        source: app.id,
        target: bankNodeId,
        type: 'smoothstep',
        animated: true,
        className: 'scam-edge-path',
        style: { stroke: '#FF4D6D', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#FF4D6D',
        },
      });
    });

    // 3. Two Bank Destination Nodes (Column 3: X = 780)
    nodes.push({
      id: 'BANK-DEST-1',
      type: 'bankDestination',
      position: { x: 780, y: 120 },
      data: {
        bankToken: 'FD-7a3f…c91',
        applicantCount: 4,
        distinctColleges: 3,
        details: 'Hashed Destination Account #1 (IFSC: PUNB012)',
      },
    });

    nodes.push({
      id: 'BANK-DEST-2',
      type: 'bankDestination',
      position: { x: 780, y: 420 },
      data: {
        bankToken: 'FD-9e2b…a44',
        applicantCount: 4,
        distinctColleges: 3,
        details: 'Hashed Destination Account #2 (IFSC: PUNB012)',
      },
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [records, highlightedBeneficiaryId]);

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNodeData(node.data);
    setIsDrawerOpen(true);
  }, []);

  const openActionModal = (action: 'ESCALATE_VIGILANCE' | 'CLEAR_CASE' | 'REQUEST_DOCUMENTS') => {
    setModalAction(action);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Climax Case Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#141C3D] via-[#0E1530] to-[#141C3D] border border-[#FF4D6D]/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF4D6D]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono-code uppercase px-2.5 py-0.5 rounded bg-[#FF4D6D]/20 text-[#FF4D6D] font-bold border border-[#FF4D6D]/40">
                Rule FIN-002 Triggered
              </span>
              <span className="text-xs font-mono-code uppercase px-2.5 py-0.5 rounded bg-[#FFB020]/20 text-[#FFB020] font-semibold border border-[#FFB020]/30">
                Severity: Needs Review
              </span>
              <span className="text-xs font-mono-code text-[#5F6B99]">
                (Statutory Golden Rule: Deterministic Evidence Only • Non-Verdict)
              </span>
            </div>

            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#E8ECFF] tracking-tight">
              Case File #SCH-CG-08 • Multi-College Bank Destination Convergence
            </h1>
            <p className="text-xs sm:text-sm text-[#9AA6D6] leading-relaxed">
              <span className="text-[#FF4D6D] font-semibold font-mono-code">
                8 applications across 3 colleges share 2 bank accounts, 0 shared households.
              </span>{' '}
              Applications span Government Engineering College Raipur, Bilaspur Institute of Technology, and Bastar Tribal Degree College.
            </p>
          </div>

          {/* Officer Action Buttons Group */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => openActionModal('ESCALATE_VIGILANCE')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#E63956] text-white text-xs font-heading font-semibold shadow-lg shadow-[#FF4D6D]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Escalate to Vigilance</span>
            </button>

            <button
              onClick={() => openActionModal('REQUEST_DOCUMENTS')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#141C3D] hover:bg-[#1C274E] text-[#FFB020] border border-[#FFB020]/40 text-xs font-heading font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Request In-Person KYC</span>
            </button>

            <button
              onClick={() => openActionModal('CLEAR_CASE')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#141C3D] hover:bg-[#1C274E] text-[#2DD4A3] border border-[#2DD4A3]/40 text-xs font-heading font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Clear Case</span>
            </button>
          </div>
        </div>

        {/* Counter-Evidence Banner: Deterministic Verification */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 pt-6 border-t border-[#9AA6D6]/10 text-xs font-mono-code">
          <div className="p-3 rounded-xl bg-[#070B1A]/80 border border-[#9AA6D6]/15 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#FF4D6D] shrink-0 mt-0.5" />
            <div>
              <span className="text-[#E8ECFF] font-semibold block">0 Shared Households Found</span>
              <span className="text-[11px] text-[#5F6B99]">All 8 applicants hold disparate municipal census IDs.</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#070B1A]/80 border border-[#9AA6D6]/15 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#FFB020] shrink-0 mt-0.5" />
            <div>
              <span className="text-[#E8ECFF] font-semibold block">FIN-001 Inapplicable</span>
              <span className="text-[11px] text-[#5F6B99]">Legitimate sibling exception strictly requires shared domicile.</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#070B1A]/80 border border-[#9AA6D6]/15 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-[#22D3EE] shrink-0 mt-0.5" />
            <div>
              <span className="text-[#E8ECFF] font-semibold block">Pre-Disbursement Hold Active</span>
              <span className="text-[11px] text-[#5F6B99]">PFMS batch treasury payout paused pending determination.</span>
            </div>
          </div>
        </div>
      </div>

      {/* React Flow Network Graph Container */}
      <div className="rounded-3xl bg-[#070B1A] border border-[#9AA6D6]/15 p-4 md:p-6 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-heading font-semibold text-base text-[#E8ECFF] flex items-center gap-2">
              <span>React Flow Evidence Relational Graph</span>
              <span className="text-[10px] font-mono-code uppercase px-2 py-0.5 rounded bg-[#5B6CFF]/20 text-[#22D3EE]">
                Interactive
              </span>
            </h3>
            <p className="text-xs text-[#5F6B99]">
              Click any node to inspect evidence attributes in drawer. Edges trace live flow of funds.
            </p>
          </div>

          {/* Graph Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono-code">
            <div className="flex items-center gap-1.5 text-[#5B6CFF]">
              <div className="w-2.5 h-2.5 rounded bg-[#5B6CFF]" />
              <span>College (3)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#22D3EE]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#22D3EE]" />
              <span>Beneficiary (8)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#FF4D6D]">
              <div className="w-2.5 h-2.5 rotate-45 bg-[#FF4D6D]" />
              <span>Hashed Destination (2)</span>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="h-[620px] w-full rounded-2xl bg-[#0A0F24] border border-[#9AA6D6]/10 overflow-hidden relative">
          <ReactFlow
            nodes={initialNodes}
            edges={initialEdges}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.5}
            maxZoom={1.5}
          >
            <Background color="#141C3D" gap={20} size={1} variant={BackgroundVariant.Dots} />
            <Controls />
          </ReactFlow>
        </div>
      </div>

      {/* Layer C Generative Explainability Trace */}
      <TypewriterTrace
        traceText={investigationTrace}
        source={traceSource}
        onRegenerate={refreshInvestigationTrace}
      />

      {/* Evidence Table: Exact Trigger Rows */}
      <div className="rounded-3xl bg-[#0E1530] border border-[#9AA6D6]/15 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-heading font-semibold text-base text-[#E8ECFF] flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-[#22D3EE]" />
              <span>Deterministic Evidence Table (FIN-002 Trigger Rows)</span>
            </h3>
            <p className="text-xs text-[#5F6B99]">
              Hovering a row highlights the corresponding node in the relational graph above.
            </p>
          </div>
          <span className="text-xs font-mono-code text-[#FF4D6D] bg-[#FF4D6D]/15 px-3 py-1 rounded-lg border border-[#FF4D6D]/30">
            8 Total Flagged Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-code border-collapse">
            <thead>
              <tr className="border-b border-[#9AA6D6]/15 text-[#5F6B99] uppercase text-[10px]">
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Applicant Name</th>
                <th className="py-3 px-4">College Institution</th>
                <th className="py-3 px-4">Hashed Bank Destination</th>
                <th className="py-3 px-4">Household Token</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4 text-right">Relational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#9AA6D6]/10 text-[#E8ECFF]">
              {flaggedApplications.map((row) => {
                const isHovered = highlightedBeneficiaryId === row.applicationId;
                return (
                  <tr
                    key={row.applicationId}
                    onMouseEnter={() => setHighlightedBeneficiaryId(row.applicationId)}
                    onMouseLeave={() => setHighlightedBeneficiaryId(null)}
                    onClick={() => {
                      setSelectedNodeData({
                        applicationId: row.applicationId,
                        studentName: row.studentName,
                        householdId: row.householdId,
                        collegeName: row.collegeName,
                        bankToken: row.bankToken,
                        amount: row.amount,
                        scheme: row.scheme,
                        category: 'OBC',
                      });
                      setIsDrawerOpen(true);
                    }}
                    className={`cursor-pointer transition-colors ${
                      isHovered ? 'bg-[#5B6CFF]/15 text-white' : 'hover:bg-[#141C3D]'
                    }`}
                  >
                    <td className="py-3 px-4 text-[#22D3EE] font-semibold">
                      {row.applicationId}
                    </td>
                    <td className="py-3 px-4 font-sans font-medium text-[#E8ECFF]">
                      {row.studentName}
                    </td>
                    <td className="py-3 px-4 text-[#9AA6D6] truncate max-w-[200px]">
                      {row.collegeName}
                    </td>
                    <td className="py-3 px-4 text-[#FF4D6D] font-bold">
                      {row.bankToken}
                    </td>
                    <td className="py-3 px-4 text-[#5F6B99]">
                      {row.householdId}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#E8ECFF]">
                      ₹{row.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#FF4D6D]/15 text-[#FF4D6D] border border-[#FF4D6D]/30">
                        Convergent
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right-Side Evidence Drawer */}
      {isDrawerOpen && selectedNodeData && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-[#0E1530] border-l border-[#5B6CFF]/30 p-6 shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-[#9AA6D6]/10">
            <h4 className="font-heading font-bold text-base text-[#E8ECFF] flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-[#22D3EE]" />
              <span>Evidence Record Card</span>
            </h4>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 rounded-lg text-[#9AA6D6] hover:text-[#E8ECFF] hover:bg-[#141C3D]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-5 mt-5">
            {/* Beneficiary Header */}
            {selectedNodeData.studentName && (
              <div className="p-4 rounded-xl bg-[#070B1A] border border-[#9AA6D6]/15 space-y-1">
                <span className="text-[10px] font-mono-code text-[#5F6B99] uppercase">Beneficiary Name</span>
                <p className="font-heading font-bold text-lg text-[#E8ECFF]">
                  {selectedNodeData.studentName}
                </p>
                <p className="text-xs font-mono-code text-[#22D3EE]">
                  {selectedNodeData.applicationId}
                </p>
              </div>
            )}

            {/* College info */}
            {selectedNodeData.collegeName && (
              <div className="space-y-1">
                <span className="text-[10px] font-mono-code text-[#5F6B99] uppercase">Enrolled Institution</span>
                <p className="text-xs font-semibold text-[#E8ECFF]">
                  {selectedNodeData.collegeName}
                </p>
              </div>
            )}

            {/* Hashed Bank Destination Token */}
            {selectedNodeData.bankToken && (
              <div className="p-3.5 rounded-xl bg-[#FF4D6D]/10 border border-[#FF4D6D]/30 space-y-1">
                <span className="text-[10px] font-mono-code text-[#FF4D6D] uppercase font-semibold">
                  Hashed Financial Destination
                </span>
                <p className="font-mono-code font-bold text-sm text-[#E8ECFF]">
                  {selectedNodeData.bankToken}
                </p>
                <p className="text-[10px] text-[#9AA6D6]">
                  Last 4 masked for statutory privacy • IFSC: PUNB012
                </p>
              </div>
            )}

            {/* Household Token */}
            {selectedNodeData.householdId && (
              <div className="space-y-1">
                <span className="text-[10px] font-mono-code text-[#5F6B99] uppercase">Municipal Domicile Token</span>
                <p className="text-xs font-mono-code text-[#E8ECFF]">
                  {selectedNodeData.householdId}
                </p>
                <p className="text-[10px] text-[#FF4D6D]">
                  No shared household detected with any other applicant routing to this destination.
                </p>
              </div>
            )}

            {/* Scholarship & Payout */}
            {selectedNodeData.amount && (
              <div className="space-y-1">
                <span className="text-[10px] font-mono-code text-[#5F6B99] uppercase">Treasury Intercept Amount</span>
                <p className="font-heading font-bold text-xl text-[#2DD4A3]">
                  ₹{selectedNodeData.amount.toLocaleString()}
                </p>
              </div>
            )}

            {/* Quick Officer Actions in Drawer */}
            <div className="pt-4 border-t border-[#9AA6D6]/10 space-y-2">
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  openActionModal('ESCALATE_VIGILANCE');
                }}
                className="w-full py-2.5 rounded-xl bg-[#FF4D6D] text-white text-xs font-semibold hover:bg-[#ff3357] transition-all"
              >
                Escalate Case to Vigilance
              </button>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  openActionModal('REQUEST_DOCUMENTS');
                }}
                className="w-full py-2.5 rounded-xl bg-[#141C3D] text-[#FFB020] border border-[#FFB020]/40 text-xs font-semibold hover:bg-[#1C274E] transition-all"
              >
                Issue KYC Verification Hold
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      <ActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultAction={modalAction}
        targetCaseId="CASE-SCH-CG-08"
        targetDescription="8 scholarship applications across 3 colleges sharing 2 bank accounts with 0 shared households"
        onSuccess={() => {
          setCurrentScreen('audit_ledger');
        }}
      />
    </div>
  );
};

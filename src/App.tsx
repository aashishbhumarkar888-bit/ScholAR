import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { CommandCenterScreen } from './screens/CommandCenterScreen';
import { EntityResolutionScreen } from './screens/EntityResolutionScreen';
import { CaseFileScreen } from './screens/CaseFileScreen';
import { FalsePositiveProofScreen } from './screens/FalsePositiveProofScreen';
import { AuditLedgerScreen } from './screens/AuditLedgerScreen';

const ScreenRenderer: React.FC = () => {
  const { currentScreen } = useApp();

  switch (currentScreen) {
    case 'command_center':
      return <CommandCenterScreen />;
    case 'entity_resolution':
      return <EntityResolutionScreen />;
    case 'case_file':
      return <CaseFileScreen />;
    case 'false_positive_proof':
      return <FalsePositiveProofScreen />;
    case 'audit_ledger':
      return <AuditLedgerScreen />;
    default:
      return <CommandCenterScreen />;
  }
};

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#070B1A] text-[#E8ECFF] selection:bg-[#5B6CFF]/30 selection:text-white">
      {/* Top Bar with Tricolor Hairline & Officer Details */}
      <TopBar />

      {/* Main Content Area with Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row max-w-[1600px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <ScreenRenderer />
        </main>
      </div>

      {/* Persistent Constitutional Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

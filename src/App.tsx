import { useState, useEffect } from 'react';
import { Header } from './components/shared/Header';
import { SideNav } from './components/shared/SideNav';
import { Sidebar } from './components/shared/Sidebar';
import { JourneyBuilderPage } from './pages/JourneyBuilderPage';
import { SimulatorPage } from './pages/SimulatorPage';
type Page = 'journey' | 'simulator';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    // Check URL hash for routing
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#simulator') return 'simulator';
    }
    return 'journey';
  });

  // Update page when hash changes
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#simulator') {
        setCurrentPage('simulator');
      } else {
        setCurrentPage('journey');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigateToSimulator = () => {
    window.location.hash = '#simulator';
    setCurrentPage('simulator');
  };

  const handleNavigateToJourney = () => {
    window.location.hash = '';
    setCurrentPage('journey');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header 
        currentPage={currentPage}
        onNavigateToSimulator={handleNavigateToSimulator}
        onNavigateToJourney={handleNavigateToJourney}
      />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side Nav (85px) */}
        <SideNav />

        {/* Sidebar (230px) */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          {currentPage === 'simulator' ? (
            <SimulatorPage />
          ) : (
            <JourneyBuilderPage />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

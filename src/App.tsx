import { useState } from 'react';
import { Header } from './components/shared/Header';
import { SideNav } from './components/shared/SideNav';
import { Sidebar } from './components/shared/Sidebar';
import { JourneyBuilder } from './components/builder/JourneyBuilder';

function App() {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header 
        isSimulatorOpen={isSimulatorOpen}
        onToggleSimulator={() => setIsSimulatorOpen(!isSimulatorOpen)}
      />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side Nav (85px) */}
        <SideNav />

        {/* Sidebar (230px) */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className={isSimulatorOpen ? "grid grid-cols-2 gap-6" : ""}>
              <div className={isSimulatorOpen ? "bg-card rounded-lg card-shadow p-6" : ""}>
                <JourneyBuilder />
              </div>
              {isSimulatorOpen && (
                <div className="bg-card rounded-lg card-shadow p-6">
                  <h2 className="text-xl font-semibold mb-4 text-foreground">
                    Member App Simulator
                  </h2>
                  <p className="text-muted-foreground">
                    Simulator panel will be implemented here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

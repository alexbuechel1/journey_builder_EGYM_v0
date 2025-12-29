import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { JourneyProvider, useJourney } from '@/contexts/JourneyContext';
import { SimulatorProvider } from '@/contexts/SimulatorContext';
import { MemberChecklist } from '@/components/checklist/MemberChecklist';
import { EventSimulatorPanel } from '@/components/checklist/EventSimulatorPanel';
import { Button } from '@/components/ui/button';
import { Play, X } from 'lucide-react';
import type { Journey } from '@/lib/types';

function ChecklistContent() {
  const [searchParams] = useSearchParams();
  const { journeys, setCurrentJourney, loadJourneys } = useJourney();
  const [isLoading, setIsLoading] = useState(true);
  const [journey, setJourney] = useState<Journey | null>(null);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  
  useEffect(() => {
    const loadChecklistJourney = async () => {
      setIsLoading(true);
      
      // Get journey ID from URL params
      const journeyId = searchParams.get('journeyId');
      
      if (!journeyId) {
        setIsLoading(false);
        return;
      }
      
      // Load journeys if not already loaded
      let journeysToSearch = journeys;
      if (journeysToSearch.length === 0) {
        await loadJourneys();
        // After loading, journeys state will update, but we need to wait for it
        // So we'll reload journeys and search again in the next effect run
        setIsLoading(false);
        return;
      }
      
      // Find the journey
      const foundJourney = journeysToSearch.find(j => j.id === journeyId);
      
      if (foundJourney) {
        setJourney(foundJourney);
        setCurrentJourney(journeyId);
      } else {
        // Journey not found - might need to reload
        setJourney(null);
      }
      
      setIsLoading(false);
    };
    
    loadChecklistJourney();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
  
  // Separate effect to handle journey loading completion
  useEffect(() => {
    const journeyId = searchParams.get('journeyId');
    if (!journeyId || journey || journeys.length === 0) return;
    
    const foundJourney = journeys.find(j => j.id === journeyId);
    if (foundJourney) {
      setJourney(foundJourney);
      setCurrentJourney(journeyId);
    }
  }, [journeys, searchParams, journey, setCurrentJourney]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-body-100 text-muted-foreground">Loading checklist...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4 md:px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-body-100-medium font-medium text-foreground">
            {journey?.name || 'Checklist'}
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSimulatorOpen(!isSimulatorOpen)}
            className="gap-2"
          >
            {isSimulatorOpen ? (
              <>
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">Close Simulator</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span className="hidden sm:inline">Open Simulator</span>
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-6 md:px-6">
        <div className={`flex gap-6 ${isSimulatorOpen ? 'flex-row' : 'flex-col'} max-w-7xl`}>
          {/* Checklist - Takes 2/3 when simulator is open, full width when closed */}
          <div className={isSimulatorOpen ? 'flex-[2]' : 'w-full'}>
            <MemberChecklist journey={journey} />
          </div>
          
          {/* Event Simulator Panel - Only shown when open, takes 1/3, right-aligned */}
          {isSimulatorOpen && (
            <div className="flex-[1] flex justify-end">
              <div className="w-full max-w-md sticky top-6">
                <EventSimulatorPanel />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ChecklistPage() {
  return (
    <JourneyProvider>
      <SimulatorProvider>
        <ChecklistContent />
      </SimulatorProvider>
    </JourneyProvider>
  );
}


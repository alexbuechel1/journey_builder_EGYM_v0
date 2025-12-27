import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { JourneyProvider, useJourney } from '@/contexts/JourneyContext';
import { MemberChecklist } from '@/components/checklist/MemberChecklist';
import type { Journey } from '@/lib/types';

function ChecklistContent() {
  const [searchParams] = useSearchParams();
  const { journeys, setCurrentJourney, loadJourneys } = useJourney();
  const [isLoading, setIsLoading] = useState(true);
  const [journey, setJourney] = useState<Journey | null>(null);
  
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
        <h1 className="text-body-100-medium font-medium text-foreground">
          {journey?.name || 'Checklist'}
        </h1>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-6 md:px-6 max-w-4xl">
        <MemberChecklist journey={journey} />
      </div>
    </div>
  );
}

export function ChecklistPage() {
  return (
    <JourneyProvider>
      <ChecklistContent />
    </JourneyProvider>
  );
}


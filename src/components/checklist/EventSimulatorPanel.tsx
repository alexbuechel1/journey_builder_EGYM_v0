import { useMemo, useState } from 'react';
import { useSimulator } from '@/contexts/SimulatorContext';
import { useJourney } from '@/contexts/JourneyContext';
import { Button } from '@/components/ui/button';
import { getActionLibraryItem } from '@/lib/actionLibrary';
import { RotateCcw, Play, CheckCircle2 } from 'lucide-react';
import type { Product } from '@/lib/types';

interface EventTrigger {
  eventType: string;
  product: Product;
  title: string;
}

export function EventSimulatorPanel() {
  const { currentJourney } = useJourney();
  const { triggerEvent, events, resetSimulation } = useSimulator();
  const [isResetting, setIsResetting] = useState(false);

  // Extract unique event types from journey actions
  const availableEvents = useMemo(() => {
    if (!currentJourney) return [];

    const eventMap = new Map<string, EventTrigger>();

    currentJourney.actions.forEach((action) => {
      const key = `${action.eventType}:${action.product}`;
      if (!eventMap.has(key)) {
        const libraryItem = getActionLibraryItem(action.actionTypeId);
        eventMap.set(key, {
          eventType: action.eventType,
          product: action.product,
          title: libraryItem?.title || action.eventType,
        });
      }
    });

    return Array.from(eventMap.values());
  }, [currentJourney]);

  const handleTriggerEvent = async (eventType: string, product: Product) => {
    await triggerEvent(eventType, product);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the simulation? This will clear all triggered events and reset the checklist to its initial state.')) {
      setIsResetting(true);
      resetSimulation();
      // Reset the loading state after a brief delay
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const hasTriggeredEvents = events.length > 0;

  if (!currentJourney) {
    return null;
  }

  if (availableEvents.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-4">
        <p className="text-body-100 text-muted-foreground">
          No events available for this journey
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-body-100-medium font-medium text-foreground">
          Event Simulator
        </h2>
        <Button
          onClick={handleReset}
          variant="outline"
          size="sm"
          disabled={isResetting}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      <p className="text-body-50 text-muted-foreground mb-4">
        Trigger events to see how they update the checklist
      </p>

      <div className="space-y-2">
        {availableEvents.map((event) => {
          const eventKey = `${event.eventType}:${event.product}`;
          const triggerCount = events.filter(
            (e) => e.eventType === event.eventType && e.product === event.product
          ).length;

          return (
            <div
              key={eventKey}
              className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border bg-muted/30"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-1 min-w-0">
                  <p className="text-body-100-medium font-medium text-foreground truncate">
                    {event.title}
                  </p>
                </div>
                {triggerCount > 0 && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-body-50 text-muted-foreground">
                      {triggerCount}x
                    </span>
                  </div>
                )}
              </div>
              <Button
                onClick={() => handleTriggerEvent(event.eventType, event.product)}
                size="sm"
                className="gap-2 flex-shrink-0 bg-foreground text-background hover:bg-foreground/90"
              >
                <Play className="h-4 w-4" />
                Trigger
              </Button>
            </div>
          );
        })}
      </div>

      {hasTriggeredEvents && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-body-50 text-muted-foreground">
            {events.length} event{events.length !== 1 ? 's' : ''} triggered
          </p>
        </div>
      )}
    </div>
  );
}


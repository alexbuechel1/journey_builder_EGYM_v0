import { useMemo, useEffect, useRef } from 'react';
import type { Journey } from '@/lib/types';
import { ChecklistItem } from './ChecklistItem';
import { getActionStatus, calculateDeadline } from '@/lib/checklistUtils';
import { useSimulator } from '@/contexts/SimulatorContext';

interface MemberChecklistProps {
  journey: Journey | null;
  entryCompletedAt?: Date;
  currentTime?: Date;
}

export function MemberChecklist({ journey, entryCompletedAt: propEntryCompletedAt, currentTime: propCurrentTime }: MemberChecklistProps) {
  const { actionInstances, entryActionCompletedAt: simulatorEntryCompletedAt, simulatedTime } = useSimulator();
  
  // Use simulator data if available, otherwise fall back to props
  const entryCompletedAt = simulatorEntryCompletedAt ?? propEntryCompletedAt;
  const currentTime = propCurrentTime ?? simulatedTime;
  // Filter and sort visible actions
  const visibleActions = useMemo(() => {
    if (!journey) return [];
    
    // Filter to only visible actions
    const visible = journey.actions.filter(action => action.visibleInChecklist);
    
    // Sort by node position to maintain journey order
    return visible.sort((a, b) => {
      const nodeA = journey.nodes.find(n => n.actionId === a.id);
      const nodeB = journey.nodes.find(n => n.actionId === b.id);
      const posA = nodeA?.position ?? 9999;
      const posB = nodeB?.position ?? 9999;
      return posA - posB;
    });
  }, [journey]);
  
  // Create a map of action instances by action ID for quick lookup
  const actionInstancesMap = useMemo(() => {
    const map = new Map<string, typeof actionInstances[0]>();
    actionInstances.forEach((instance) => {
      map.set(instance.id, instance);
    });
    return map;
  }, [actionInstances]);

  // Calculate journey progress
  const journeyProgress = useMemo(() => {
    if (!journey || visibleActions.length === 0) {
      return { completedCount: 0, totalCount: 0, percentage: 0 };
    }
    
    let completedCount = 0;
    
    visibleActions.forEach((action) => {
      const instance = actionInstancesMap.get(action.id);
      const deadline = instance?.deadline ?? calculateDeadline(
        action,
        entryCompletedAt || new Date(),
        undefined
      );
      
      const completedAt = instance?.completedAt;
      const currentCount = instance?.currentCount ?? 0;
      
      const status = getActionStatus(action, deadline, currentTime, completedAt, currentCount);
      
      if (status === 'DONE') {
        completedCount++;
      }
    });
    
    const totalCount = visibleActions.length;
    const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    
    return { completedCount, totalCount, percentage };
  }, [journey, visibleActions, entryCompletedAt, currentTime, actionInstancesMap]);
  
  // Keyboard navigation refs
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Reset refs array when visibleActions changes
  useEffect(() => {
    itemRefs.current = [];
  }, [visibleActions.length]);
  
  // Keyboard navigation support
  useEffect(() => {
    if (visibleActions.length === 0) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if focus is within checklist
      const focusedElement = document.activeElement;
      const isInChecklist = itemRefs.current.some(ref => ref?.contains(focusedElement));
      
      if (!isInChecklist) return;
      
      // Arrow keys to navigate between items
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const currentIndex = itemRefs.current.findIndex(ref => ref?.contains(focusedElement));
        const nextIndex = Math.min(currentIndex + 1, itemRefs.current.length - 1);
        itemRefs.current[nextIndex]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIndex = itemRefs.current.findIndex(ref => ref?.contains(focusedElement));
        const nextIndex = Math.max(currentIndex - 1, 0);
        itemRefs.current[nextIndex]?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visibleActions.length]);
  
  // Early returns AFTER all hooks
  if (!journey) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-body-100 text-muted-foreground mb-2">
            No journey selected
          </p>
          <p className="text-body-50 text-muted-foreground">
            Please select a journey in the builder to view the checklist
          </p>
        </div>
      </div>
    );
  }
  
  if (visibleActions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-body-100 text-muted-foreground mb-2">
            No visible actions
          </p>
          <p className="text-body-50 text-muted-foreground">
            This journey doesn't have any actions visible in the checklist
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {/* Skip Link for Keyboard Navigation */}
      <a
        href="#checklist-start"
        className="sr-only focus:static focus:w-auto focus:h-auto focus:p-4 focus:m-0 focus:overflow-visible focus:clip-auto focus:whitespace-normal focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Skip to checklist
      </a>
      
      {/* Motivational Header Greeting */}
      {visibleActions.length > 0 && (
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
            Welcome John 👋
          </h2>
          <p className="text-body-100 text-muted-foreground">
            Complete these easy steps for your best training experience
          </p>
        </div>
      )}
      
      {/* Journey Progress Overview */}
      {visibleActions.length > 0 && (
        <div className="mb-12x p-12x bg-card rounded-lg border border-border card-shadow" role="region" aria-label="Journey progress">
          <div className="flex items-center justify-between mb-4x">
            <h2 className="text-body-100-medium font-medium">Your Journey Progress</h2>
            <span className="text-body-50-bold text-muted-foreground">
              {journeyProgress.completedCount} of {journeyProgress.totalCount} completed
            </span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${journeyProgress.percentage}%` }}
              role="progressbar"
              aria-valuenow={journeyProgress.completedCount}
              aria-valuemin={0}
              aria-valuemax={journeyProgress.totalCount}
              aria-label={`${journeyProgress.completedCount} of ${journeyProgress.totalCount} steps completed`}
            />
          </div>
        </div>
      )}
      
      {/* Checklist Items */}
      <div id="checklist-start" className="space-y-12x" role="list" aria-label="Journey checklist">
        {visibleActions.map((action, index) => {
          // Get action instance data if available
          const instance = actionInstancesMap.get(action.id);
          const completedAt = instance?.completedAt;
          const currentCount = instance?.currentCount ?? 0;
          
          // Calculate previous action completion for WITH_PREVIOUS calculations
          // Find the most recent completed action before this one
          let previousActionCompletedAt: Date | undefined = entryCompletedAt;
          for (let i = index - 1; i >= 0; i--) {
            const prevAction = visibleActions[i];
            const prevInstance = actionInstancesMap.get(prevAction.id);
            if (prevInstance?.completedAt) {
              previousActionCompletedAt = prevInstance.completedAt;
              break;
            }
          }
          
          const isLast = index === visibleActions.length - 1;
          
          return (
            <div
              key={action.id}
              role="listitem"
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              tabIndex={0}
              className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:rounded-lg"
            >
              <ChecklistItem
                action={action}
                entryCompletedAt={entryCompletedAt}
                previousActionCompletedAt={previousActionCompletedAt}
                currentCount={currentCount}
                completedAt={completedAt}
                currentTime={currentTime}
                stepNumber={index + 1}
                isLast={isLast}
                showConnector={true}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}


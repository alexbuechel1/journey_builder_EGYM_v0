import { useMemo } from 'react';
import type { Journey } from '@/lib/types';
import { ChecklistItem } from './ChecklistItem';
import { getActionStatus, calculateDeadline } from '@/lib/checklistUtils';

interface MemberChecklistProps {
  journey: Journey | null;
  entryCompletedAt?: Date;
  currentTime?: Date;
}

export function MemberChecklist({ journey, entryCompletedAt, currentTime = new Date() }: MemberChecklistProps) {
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
  
  // Calculate journey progress
  const journeyProgress = useMemo(() => {
    if (!journey || visibleActions.length === 0) {
      return { completedCount: 0, totalCount: 0, percentage: 0 };
    }
    
    let completedCount = 0;
    let previousActionCompletedAt: Date | undefined = entryCompletedAt;
    
    visibleActions.forEach((action) => {
      const deadline = calculateDeadline(
        action,
        entryCompletedAt || new Date(),
        previousActionCompletedAt
      );
      
      // For read-only checklist, we don't have actual completion data
      // This will be enhanced when simulation is added
      const completedAt = undefined;
      const currentCount = 0;
      
      const status = getActionStatus(action, deadline, currentTime, completedAt, currentCount);
      
      if (status === 'DONE') {
        completedCount++;
      }
    });
    
    const totalCount = visibleActions.length;
    const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    
    return { completedCount, totalCount, percentage };
  }, [journey, visibleActions, entryCompletedAt, currentTime]);
  
  // Track previous action completion for WITH_PREVIOUS calculations
  let previousActionCompletedAt: Date | undefined = entryCompletedAt;
  
  return (
    <>
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
      <div className="space-y-12x" role="list" aria-label="Journey checklist">
        {visibleActions.map((action, index) => {
          // For read-only checklist, we don't have actual completion data
          // This will be enhanced when simulation is added
          const completedAt = undefined;
          const currentCount = 0;
          
          // Calculate previous action completion
          // In a real scenario, this would come from event data
          const prevCompletedAt = previousActionCompletedAt;
          
          // After rendering, update previous for next iteration
          // (In real implementation, this would be based on actual completion)
          if (index > 0 && prevCompletedAt) {
            // For demo purposes, assume actions complete sequentially
            // This will be replaced with real data in Phase 4
          }
          
          return (
            <div key={action.id} role="listitem">
              <ChecklistItem
                action={action}
                entryCompletedAt={entryCompletedAt}
                previousActionCompletedAt={prevCompletedAt}
                currentCount={currentCount}
                completedAt={completedAt}
                currentTime={currentTime}
                stepNumber={index + 1}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}


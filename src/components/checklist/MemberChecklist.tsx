import { useMemo } from 'react';
import type { Journey } from '@/lib/types';
import { ChecklistItem } from './ChecklistItem';

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
  
  // Track previous action completion for WITH_PREVIOUS calculations
  let previousActionCompletedAt: Date | undefined = entryCompletedAt;
  
  return (
    <div className="space-y-4">
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
          <ChecklistItem
            key={action.id}
            action={action}
            entryCompletedAt={entryCompletedAt}
            previousActionCompletedAt={prevCompletedAt}
            currentCount={currentCount}
            completedAt={completedAt}
            currentTime={currentTime}
          />
        );
      })}
    </div>
  );
}


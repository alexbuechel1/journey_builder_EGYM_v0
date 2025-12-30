import { useMemo } from 'react';
import type { Action } from '@/lib/types';
import {
  calculateTimelinePositions,
} from '@/lib/timelineUtils';
import { getActionLibraryItem } from '@/lib/actionLibrary';

interface TimelineViewProps {
  actions: Action[];
  onActionClick?: (actionId: string) => void;
}

/**
 * Format days into a readable date label
 */
function formatTimelineLabel(days: number): string {
  if (days === 0) return 'Start';
  
  if (days < 7) {
    return `${days} ${days === 1 ? 'Day' : 'Days'}`;
  } else if (days < 30) {
    const weeks = Math.round(days / 7);
    return `${weeks} ${weeks === 1 ? 'Week' : 'Weeks'}`;
  } else if (days < 365) {
    const months = Math.round(days / 30);
    return `${months} ${months === 1 ? 'Month' : 'Months'}`;
  } else {
    const years = Math.round(days / 365);
    return `${years} ${years === 1 ? 'Year' : 'Years'}`;
  }
}

interface TimeBucket {
  label: string;
  days: number;
  actions: Array<{
    actionId: string;
    action: Action;
    title: string;
    isEntryAction: boolean;
  }>;
}

export function TimelineView({ actions, onActionClick }: TimelineViewProps) {
  const { buckets, actionsWithoutDeadlines } = useMemo(() => {
    if (actions.length === 0) {
      return { buckets: [], actionsWithoutDeadlines: [] };
    }

    const calculatedPositions = calculateTimelinePositions(actions);
    const actionsWithDeadlines = calculatedPositions.filter(p => p.days >= 0);
    const actionsWithoutDeadlines = calculatedPositions.filter(p => p.days < 0);

    // Group actions by their formatted time label (to group e.g., 28 days and 30 days both as "1 Month")
    const bucketsMap = new Map<string, TimeBucket>();

    actionsWithDeadlines.forEach((pos, index) => {
      const libraryItem = getActionLibraryItem(pos.action.actionTypeId);
      const title = libraryItem?.title || pos.action.actionTypeId;
      const isEntryAction = index === 0 && pos.days === 0;
      
      // Use formatted label as bucket key to group actions with same label (e.g., "1 Month")
      const label = formatTimelineLabel(pos.days);
      const bucketKey = label;
      
      if (!bucketsMap.has(bucketKey)) {
        bucketsMap.set(bucketKey, {
          label: label,
          days: pos.days, // Keep the minimum days for sorting
          actions: [],
        });
      }
      
      bucketsMap.get(bucketKey)!.actions.push({
        actionId: pos.actionId,
        action: pos.action,
        title,
        isEntryAction,
      });
      
      // Update days to minimum for this bucket (for sorting)
      const bucket = bucketsMap.get(bucketKey)!;
      if (pos.days < bucket.days) {
        bucket.days = pos.days;
      }
    });

    // Convert map to array and sort by days
    const buckets = Array.from(bucketsMap.values()).sort((a, b) => a.days - b.days);

    return { buckets, actionsWithoutDeadlines };
  }, [actions]);

  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Timeline items grouped by time buckets */}
      <div className="flex flex-col relative">
        {/* Continuous vertical line connecting all timeframe dots - centered on dots */}
        {buckets.length > 1 && (
          <div 
            className="absolute w-0.5 bg-primary/60"
            style={{
              left: '7px', // Center of w-4 container (8px) minus half line width (0.5px for w-0.5)
              top: '5px', // Start from first dot center (accounting for dot size)
              bottom: actionsWithoutDeadlines.length > 0 ? '4rem' : '0',
            }}
          />
        )}
        
        {buckets.map((bucket, bucketIndex) => {
          const isLast = bucketIndex === buckets.length - 1 && actionsWithoutDeadlines.length === 0;
          
          return (
            <div key={`bucket-${bucket.days}`} className="flex items-start gap-2 relative z-10">
              {/* Timeline dot - all orange, centered */}
              <div className="flex-shrink-0 w-4 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full border-2 border-white shadow-md bg-primary"></div>
              </div>
              
              {/* Time bucket content */}
              <div className="flex-1 min-w-0 pb-4">
                {/* Time label */}
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  {bucket.label}
                </div>
                
                {/* Actions in this bucket */}
                <div className="flex flex-col gap-1.5 ml-2">
                  {bucket.actions.map((actionItem, actionIndex) => {
                    const isLastInBucket = actionIndex === bucket.actions.length - 1;
                    const isLastOverall = isLast && isLastInBucket;
                    
                    return (
                      <div key={`action-${actionItem.actionId}`} className="flex items-start gap-2 group">
                        {/* Sub-timeline line for actions in same bucket */}
                        <div className="flex flex-col items-center pt-1.5">
                          {/* All action dots orange */}
                          <div className="w-1.5 h-1.5 rounded-full border border-white shadow-sm bg-primary transition-transform group-hover:scale-125"></div>
                          {!isLastOverall && (
                            <div className="w-0.5 h-full min-h-[1.5rem] bg-primary/20 mt-1"></div>
                          )}
                        </div>
                        
                        {/* Action title */}
                        <div className="flex-1 min-w-0 pb-3">
                          <button
                            onClick={() => onActionClick?.(actionItem.actionId)}
                            className="text-sm text-foreground hover:text-primary transition-colors text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded"
                          >
                            {actionItem.title}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Actions without deadlines */}
        {actionsWithoutDeadlines.length > 0 && (
          <div className="flex items-start gap-2 group mt-2 pt-2 border-t border-border">
            <div className="flex flex-col items-center pt-1">
              <div className="w-2 h-2 rounded-full bg-primary border-2 border-white shadow-sm"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-muted-foreground mb-2">
                No deadline
              </div>
              <div className="flex flex-col gap-1.5 ml-2">
                {actionsWithoutDeadlines.map((pos) => {
                  const libraryItem = getActionLibraryItem(pos.action.actionTypeId);
                  const title = libraryItem?.title || pos.action.actionTypeId;
                  return (
                    <button
                      key={`action-${pos.actionId}`}
                      onClick={() => onActionClick?.(pos.actionId)}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded"
                    >
                      {title}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

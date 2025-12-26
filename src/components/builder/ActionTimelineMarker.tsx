import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Action } from '@/lib/types';
import { getActionLibraryItem } from '@/lib/actionLibrary';

interface ActionTimelineMarkerProps {
  action: Action;
  position: number; // Percentage position (0-100)
  isEntryAction: boolean;
  onClick?: () => void;
}

export function ActionTimelineMarker({
  action,
  position,
  isEntryAction,
  onClick,
}: ActionTimelineMarkerProps) {
  const libraryItem = getActionLibraryItem(action.actionTypeId);
  const title = libraryItem?.title || action.actionTypeId;

  // Color based on time range type
  const getColor = () => {
    if (isEntryAction) return 'bg-green-500';
    if (action.timeRange.type === 'ABSOLUTE') return 'bg-blue-500';
    if (action.timeRange.type === 'WITH_PREVIOUS') {
      if (action.timeRange.offsetDays === 0 || action.timeRange.offsetDays === undefined) {
        return 'bg-orange-500';
      }
      return 'bg-orange-400';
    }
    return 'bg-gray-400'; // No deadline
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={`absolute top-0 flex flex-col items-center cursor-pointer transition-transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded-full`}
            style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
            aria-label={`Action: ${title}`}
          >
            {/* Marker dot */}
            <div className={`w-3 h-3 rounded-full ${getColor()} border-2 border-white shadow-sm`}></div>
            {/* Connection line (optional, can be styled differently) */}
            <div className="w-0.5 h-2 bg-transparent"></div>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-medium">{title}</p>
            {action.timeRange.type === 'NONE' && (
              <p className="text-xs text-muted-foreground">No deadline</p>
            )}
            {action.timeRange.type === 'ABSOLUTE' && (() => {
              const unit = action.timeRange.durationUnit || 'DAYS';
              const days = action.timeRange.durationDays || 0;
              let displayValue: number;
              let unitLabel: string;
              if (unit === 'WEEKS') {
                displayValue = Math.round(days / 7);
                unitLabel = displayValue === 1 ? 'week' : 'weeks';
              } else if (unit === 'MONTHS') {
                displayValue = Math.round(days / 30);
                unitLabel = displayValue === 1 ? 'month' : 'months';
              } else {
                displayValue = days;
                unitLabel = days === 1 ? 'day' : 'days';
              }
              return (
                <p className="text-xs text-muted-foreground">
                  {displayValue} {unitLabel} from start
                </p>
              );
            })()}
            {action.timeRange.type === 'WITH_PREVIOUS' && (
              <p className="text-xs text-muted-foreground">
                {action.timeRange.offsetDays === 0 || action.timeRange.offsetDays === undefined
                  ? 'With previous'
                  : (() => {
                      const unit = action.timeRange.offsetUnit || 'DAYS';
                      const days = action.timeRange.offsetDays;
                      let displayValue: number;
                      let unitLabel: string;
                      if (unit === 'WEEKS') {
                        displayValue = Math.round(days / 7);
                        unitLabel = displayValue === 1 ? 'week' : 'weeks';
                      } else if (unit === 'MONTHS') {
                        displayValue = Math.round(days / 30);
                        unitLabel = displayValue === 1 ? 'month' : 'months';
                      } else {
                        displayValue = days;
                        unitLabel = days === 1 ? 'day' : 'days';
                      }
                      return `${displayValue} ${unitLabel} after previous`;
                    })()}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}


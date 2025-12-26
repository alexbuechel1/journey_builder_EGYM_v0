import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { TimelineMarker as TimelineMarkerType } from '@/lib/timelineUtils';

interface TimelineMarkerProps {
  marker: TimelineMarkerType;
  position: number; // Percentage position (0-100)
}

export function TimelineMarker({ marker, position }: TimelineMarkerProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="absolute top-0 flex flex-col items-center cursor-help"
            style={{ left: `${position}%` }}
          >
            {/* Vertical line */}
            <div className="w-0.5 h-4 bg-primary/40"></div>
            {/* Label */}
            <div className="mt-1 text-xs text-muted-foreground whitespace-nowrap">
              {marker.label}
            </div>
            {/* Day count - show in appropriate unit */}
            <div className="text-[10px] text-muted-foreground/70">
              {marker.unit === 'WEEKS' && `${Math.round(marker.days / 7)} ${Math.round(marker.days / 7) === 1 ? 'week' : 'weeks'}`}
              {marker.unit === 'MONTHS' && `${Math.round(marker.days / 30)} ${Math.round(marker.days / 30) === 1 ? 'month' : 'months'}`}
              {marker.unit === 'YEARS' && `${Math.round(marker.days / 365)} ${Math.round(marker.days / 365) === 1 ? 'year' : 'years'}`}
              {marker.unit === 'DAYS' && `${marker.days} ${marker.days === 1 ? 'day' : 'days'}`}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            {marker.label} ({marker.days} {marker.days === 1 ? 'day' : 'days'})
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}


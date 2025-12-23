import type { Action } from '@/lib/types';
import { getActionLibraryItem } from '@/lib/actionLibrary';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Zap, Edit2, Trash2, GripVertical, Bell } from 'lucide-react';

interface ActionCardProps {
  action: Action;
  isEntryAction: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<Action>) => void;
  dragHandleProps?: any;
}

export function ActionCard({
  action,
  isEntryAction,
  onEdit,
  onDelete,
  onUpdate: _onUpdate, // Unused but required by interface
  dragHandleProps,
}: ActionCardProps) {
  const libraryItem = getActionLibraryItem(action.actionTypeId);
  const title = libraryItem?.title || action.actionTypeId;

  // Build first row badges: Visible, Product, and Guidance
  const firstRowBadges: string[] = [];
  if (action.visibleInChecklist) firstRowBadges.push('Visible');
  firstRowBadges.push(action.product);
  if (action.supportsGuidance && action.guidanceEnabled) {
    firstRowBadges.push('Guidance');
  }

  // Time range for second row
  const timeRangeLabel: string | null = action.timeRange.type === 'NONE' 
    ? null 
    : action.timeRange.type === 'ABSOLUTE'
    ? `${action.timeRange.durationDays}d`
    : `${action.timeRange.offsetDays}d after`;

  return (
    <div className="relative group">
      <Card className="bg-white border border-border shadow-sm hover:shadow-md transition-all duration-200 overflow-visible">
        {/* Entry Event Badge - Positioned on top border */}
        {isEntryAction && (
          <div className="absolute -top-[calc(0.625rem+1px)] left-1/2 -translate-x-1/2 z-10">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-wellpass/10 text-wellpass border border-wellpass/20">
              Entry Event
            </span>
          </div>
        )}
        
        {/* Header Section */}
        <div className="px-3 py-2.5 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              {/* Drag Handle */}
              <div
                {...dragHandleProps}
                className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                aria-label="Drag to reorder action"
              >
                <GripVertical className="h-4 w-4" aria-hidden="true" />
              </div>

              {/* Icon + Title */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="flex-shrink-0 w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                  <Zap className="h-3 w-3 text-primary" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground truncate">{title}</h3>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={onEdit}
                className="h-7 w-7 hover:bg-muted"
                aria-label="Edit action"
              >
                <Edit2 className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                aria-label="Delete action"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>

        {/* Configuration as inline badges */}
        {(firstRowBadges.length > 0 || timeRangeLabel || action.reminders.length > 0) && (
          <div className="px-3 py-2.5 border-t border-border space-y-2">
            {/* First row: Visible and Product */}
            {firstRowBadges.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {firstRowBadges.map((badge, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}

            {/* Second row: Time range */}
            {timeRangeLabel && (
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
                  {timeRangeLabel}
                </span>
              </div>
            )}

            {/* Reminders: Channel + Frequency */}
            {action.reminders.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {action.reminders.map((reminder) => {
                  const channel = reminder.channel === 'PUSH' ? 'Push' : 
                                reminder.channel === 'EMAIL' ? 'Email' : 
                                reminder.channel === 'TRAINER' ? 'Trainer' : 'Webhook';
                  const frequency = reminder.frequencyType === 'ONCE' 
                    ? 'Once' 
                    : `Every ${reminder.frequencyDays || 3}d`;
                  
                  return (
                    <div key={reminder.id} className="flex items-center gap-1.5">
                      <Bell className="h-3 w-3 text-primary flex-shrink-0" aria-hidden="true" />
                      <span className="text-[10px] text-muted-foreground">
                        <span className="font-medium text-foreground">{channel}</span>
                        {' '}
                        <span className="text-muted-foreground">({frequency})</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}


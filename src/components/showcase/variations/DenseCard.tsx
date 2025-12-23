import type { Action } from '@/lib/types';
import { getActionLibraryItem } from '@/lib/actionLibrary';
import { Card } from '@/components/ui/card';
import { Zap, CheckCircle2, XCircle, Bell, Clock } from 'lucide-react';

interface DenseCardProps {
  action: Action;
  isEntryAction: boolean;
}

export function DenseCard({ action, isEntryAction }: DenseCardProps) {
  const libraryItem = getActionLibraryItem(action.actionTypeId);
  const title = libraryItem?.title || action.actionTypeId;

  return (
    <div className="relative">
      <Card className="bg-white border border-border shadow-sm hover:shadow-md transition-all duration-200 overflow-visible">
        {/* Entry Event Badge */}
        {isEntryAction && (
          <div className="absolute -top-[calc(0.625rem+1px)] left-1/2 -translate-x-1/2 z-10">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-wellpass/10 text-wellpass border border-wellpass/20">
              Entry Event
            </span>
          </div>
        )}

        {/* Compact Header */}
        <div className="px-3 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
              <Zap className="h-3 w-3 text-primary" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-semibold text-foreground flex-1">{title}</h3>
            <CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden="true" />
          </div>
        </div>

        {/* All Configuration Visible - Compact Grid */}
        <div className="px-3 py-2 border-b border-border">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Visible:</span>
              {action.visibleInChecklist ? (
                <CheckCircle2 className="h-3 w-3 text-success" aria-hidden="true" />
              ) : (
                <XCircle className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Product:</span>
              <span className="text-foreground font-medium">{action.product}</span>
            </div>
            {action.supportsGuidance && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Guidance:</span>
                {action.guidanceEnabled ? (
                  <CheckCircle2 className="h-3 w-3 text-success" aria-hidden="true" />
                ) : (
                  <XCircle className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                )}
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Count:</span>
              <span className="text-foreground font-medium">{action.requiredCount || 1}</span>
            </div>
          </div>
        </div>

        {/* Deadline & Reminders - Compact */}
        <div className="px-3 py-2">
          <div className="space-y-1.5">
            {action.timeRange.type !== 'NONE' && (
              <div className="flex items-center gap-1.5 text-xs">
                <Clock className="h-3 w-3 text-primary flex-shrink-0" aria-hidden="true" />
                <span className="text-muted-foreground">Deadline:</span>
                <span className="text-foreground">
                  {action.timeRange.type === 'ABSOLUTE'
                    ? `${action.timeRange.durationDays}d`
                    : `${action.timeRange.offsetDays}d after`}
                </span>
              </div>
            )}
            {action.reminders.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs">
                <Bell className="h-3 w-3 text-primary flex-shrink-0" aria-hidden="true" />
                <span className="text-muted-foreground">Reminders:</span>
                <div className="flex items-center gap-1">
                  {action.reminders.map((reminder, idx) => {
                    const channel = reminder.channel === 'PUSH' ? 'P' : reminder.channel === 'EMAIL' ? 'E' : 'T';
                    return (
                      <span key={reminder.id} className="text-foreground font-medium">
                        {channel}{idx < action.reminders.length - 1 ? ',' : ''}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}


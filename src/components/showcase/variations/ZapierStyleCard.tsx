import type { Action } from '@/lib/types';
import { getActionLibraryItem } from '@/lib/actionLibrary';
import { Card } from '@/components/ui/card';
import { Zap, CheckCircle2, Bell } from 'lucide-react';

interface ZapierStyleCardProps {
  action: Action;
  isEntryAction: boolean;
}

export function ZapierStyleCard({ action, isEntryAction }: ZapierStyleCardProps) {
  const libraryItem = getActionLibraryItem(action.actionTypeId);
  const title = libraryItem?.title || action.actionTypeId;

  // Build inline badges for configuration
  const configBadges: string[] = [];
  if (action.visibleInChecklist) configBadges.push('Visible');
  configBadges.push(action.product);
  if (action.timeRange.type !== 'NONE') {
    if (action.timeRange.type === 'ABSOLUTE') {
      configBadges.push(`${action.timeRange.durationDays}d`);
    } else {
      configBadges.push(`${action.timeRange.offsetDays}d after`);
    }
  }
  if (action.reminders.length > 0) {
    const reminder = action.reminders[0];
    const channel = reminder.channel === 'PUSH' ? 'Push' : reminder.channel === 'EMAIL' ? 'Email' : 'Trainer';
    configBadges.push(channel);
  }

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

        {/* Compact Header - Single line with icon, title, and status */}
        <div className="px-3 py-2.5 flex items-center gap-2.5">
          <div className="flex-shrink-0 w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
            <Zap className="h-3 w-3 text-primary" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-foreground truncate">{title}</h3>
          </div>
          <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" aria-hidden="true" />
        </div>

        {/* Configuration as inline badges */}
        {configBadges.length > 0 && (
          <div className="px-3 pb-2.5 border-t border-border">
            <div className="flex items-center gap-1.5 flex-wrap pt-2">
              {configBadges.map((badge, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reminders as compact inline indicators */}
        {action.reminders.length > 1 && (
          <div className="px-3 pb-2.5 border-t border-border">
            <div className="flex items-center gap-1.5 pt-2">
              <Bell className="h-3 w-3 text-primary" aria-hidden="true" />
              <span className="text-xs text-muted-foreground">
                {action.reminders.length} reminders
              </span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}


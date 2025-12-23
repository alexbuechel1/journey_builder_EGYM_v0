import type { Action } from '@/lib/types';
import { getActionLibraryItem } from '@/lib/actionLibrary';
import { Card } from '@/components/ui/card';
import { Zap, Eye, Info, Bell, Clock } from 'lucide-react';

interface BaserowStyleCardProps {
  action: Action;
  isEntryAction: boolean;
}

export function BaserowStyleCard({ action, isEntryAction }: BaserowStyleCardProps) {
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

        {/* Header */}
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          </div>
        </div>

        {/* Configuration Section - Visual icon grid */}
        <div className="px-4 py-3 border-b border-border">
          <div className="grid grid-cols-3 gap-2">
            {/* Visibility Card */}
            <div className={`p-2 rounded-md border ${action.visibleInChecklist ? 'border-primary bg-primary/5' : 'border-border bg-muted/30'}`}>
              <div className="flex flex-col items-center gap-1">
                <Eye className={`h-4 w-4 ${action.visibleInChecklist ? 'text-primary' : 'text-muted-foreground'}`} aria-hidden="true" />
                <span className="text-[10px] text-muted-foreground text-center">Visibility</span>
              </div>
            </div>

            {/* Product Card */}
            <div className="p-2 rounded-md border border-border bg-muted/30">
              <div className="flex flex-col items-center gap-1">
                <div className="h-4 w-4 rounded bg-primary/20 flex items-center justify-center">
                  <span className="text-[8px] font-medium text-primary">{action.product}</span>
                </div>
                <span className="text-[10px] text-muted-foreground text-center">Product</span>
              </div>
            </div>

            {/* Guidance Card */}
            {action.supportsGuidance && (
              <div className={`p-2 rounded-md border ${action.guidanceEnabled ? 'border-primary bg-primary/5' : 'border-border bg-muted/30'}`}>
                <div className="flex flex-col items-center gap-1">
                  <Info className={`h-4 w-4 ${action.guidanceEnabled ? 'text-primary' : 'text-muted-foreground'}`} aria-hidden="true" />
                  <span className="text-[10px] text-muted-foreground text-center">Guidance</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Deadline & Reminders Section - Prominent */}
        <div className="px-4 py-3">
          <div className="space-y-2">
            {/* Deadline */}
            {action.timeRange.type !== 'NONE' && (
              <div className="flex items-center gap-2 p-2 rounded-md border border-border bg-muted/20">
                <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
                <div className="flex-1">
                  <div className="text-xs font-medium text-foreground">Deadline</div>
                  <div className="text-[10px] text-muted-foreground">
                    {action.timeRange.type === 'ABSOLUTE' 
                      ? `${action.timeRange.durationDays} days from start`
                      : `${action.timeRange.offsetDays} days after previous`}
                  </div>
                </div>
              </div>
            )}

            {/* Reminders */}
            {action.reminders.length > 0 && (
              <div className="flex items-center gap-2 p-2 rounded-md border border-primary/20 bg-primary/5">
                <Bell className="h-4 w-4 text-primary" aria-hidden="true" />
                <div className="flex-1">
                  <div className="text-xs font-medium text-foreground">Reminders</div>
                  <div className="text-[10px] text-muted-foreground">
                    {action.reminders.length} configured
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}


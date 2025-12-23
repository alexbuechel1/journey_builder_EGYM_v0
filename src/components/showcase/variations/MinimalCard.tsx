import { useState } from 'react';
import type { Action } from '@/lib/types';
import { getActionLibraryItem } from '@/lib/actionLibrary';
import { Card } from '@/components/ui/card';
import { Zap, ChevronDown, ChevronUp } from 'lucide-react';

interface MinimalCardProps {
  action: Action;
  isEntryAction: boolean;
}

export function MinimalCard({ action, isEntryAction }: MinimalCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const libraryItem = getActionLibraryItem(action.actionTypeId);
  const title = libraryItem?.title || action.actionTypeId;

  return (
    <div className="relative">
      <Card className="bg-white border border-border/50 shadow-sm hover:shadow-md transition-all duration-200 overflow-visible">
        {/* Entry Event Badge */}
        {isEntryAction && (
          <div className="absolute -top-[calc(0.625rem+1px)] left-1/2 -translate-x-1/2 z-10">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-wellpass/10 text-wellpass border border-wellpass/20">
              Entry Event
            </span>
          </div>
        )}

        {/* Clean Header - Minimal */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                <Zap className="h-4 w-4 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-base font-medium text-foreground">{title}</h3>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-muted rounded transition-colors"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Configuration - Hidden by default, shown on expand */}
        {isExpanded && (
          <div className="px-5 pb-4 border-t border-border/50">
            <div className="pt-4 space-y-3">
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center justify-between py-1">
                  <span>Visible for user</span>
                  <span className={action.visibleInChecklist ? 'text-primary' : 'text-muted-foreground'}>
                    {action.visibleInChecklist ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span>Product</span>
                  <span className="text-foreground">{action.product}</span>
                </div>
                {action.supportsGuidance && (
                  <div className="flex items-center justify-between py-1">
                    <span>Guidance</span>
                    <span className={action.guidanceEnabled ? 'text-primary' : 'text-muted-foreground'}>
                      {action.guidanceEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between py-1">
                  <span>Deadline</span>
                  <span className="text-foreground">
                    {action.timeRange.type === 'NONE' 
                      ? 'None'
                      : action.timeRange.type === 'ABSOLUTE'
                      ? `${action.timeRange.durationDays} days`
                      : `${action.timeRange.offsetDays} days after`}
                  </span>
                </div>
                {action.reminders.length > 0 && (
                  <div className="flex items-center justify-between py-1">
                    <span>Reminders</span>
                    <span className="text-foreground">{action.reminders.length}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}


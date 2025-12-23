import { useState } from 'react';
import type { Action } from '@/lib/types';
import { getActionLibraryItem } from '@/lib/actionLibrary';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Zap, Edit2, Trash2, GripVertical, Bell, ChevronDown, ChevronUp, Settings } from 'lucide-react';

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
  onUpdate,
  dragHandleProps,
}: ActionCardProps) {
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);
  const [isRemindersExpanded, setIsRemindersExpanded] = useState(false);
  const libraryItem = getActionLibraryItem(action.actionTypeId);
  const title = libraryItem?.title || action.actionTypeId;

  const handleToggle = (field: 'visibleInChecklist' | 'guidanceEnabled') => {
    onUpdate({ [field]: !action[field] });
  };

  const handleProductChange = (product: string) => {
    onUpdate({ product: product as Action['product'] });
  };

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
        <div className="px-4 py-3 border-b border-border bg-muted/30">
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
                <div className="flex-shrink-0 w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                  <Zap className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground truncate">{title}</h3>
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

        {/* Configuration Options - Collapsible - Always visible */}
        <div className="px-4 py-3 border-t border-border">
          <button
            onClick={() => setIsConfigExpanded(!isConfigExpanded)}
            className="w-full flex items-center justify-between text-sm font-medium text-foreground hover:text-primary transition-colors py-1 group"
            aria-label={isConfigExpanded ? 'Collapse configuration' : 'Expand configuration'}
            aria-expanded={isConfigExpanded}
          >
            <span className="flex items-center gap-2.5">
              <Settings className={`h-4 w-4 transition-colors ${isConfigExpanded ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} aria-hidden="true" />
              <span>Configuration</span>
              {!isConfigExpanded && (
                <span className="text-xs text-muted-foreground font-normal ml-1">
                  • {action.product}
                  {action.timeRange.type !== 'NONE' && ` • ${action.timeRange.type === 'ABSOLUTE' ? `${action.timeRange.durationDays}d` : `${action.timeRange.offsetDays}d after`}`}
                </span>
              )}
            </span>
            {isConfigExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            )}
          </button>

          {isConfigExpanded && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Visible for user */}
                <div className="flex items-center justify-between p-3 rounded-md border border-border bg-muted/30">
                  <div className="min-w-0 flex-1">
                    <label className="text-sm font-medium text-foreground block truncate">Visible for user</label>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">Show in checklist</p>
                  </div>
                  <Switch
                    checked={action.visibleInChecklist}
                    disabled
                    className="opacity-60"
                  />
                </div>

                {/* Product Selector */}
                <div className="p-3 rounded-md border border-border bg-muted/30">
                  <label className="text-sm font-medium text-foreground block mb-2">Product</label>
                  <Select
                    value={action.product}
                    disabled
                  >
                    <SelectTrigger className="w-full h-9 text-sm opacity-60 cursor-not-allowed">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {action.supportedProducts.map((product) => (
                        <SelectItem key={product} value={product}>
                          {product}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Guidance Toggle (only if supported) */}
                {action.supportsGuidance && (
                  <div className="flex items-center justify-between p-3 rounded-md border border-border bg-muted/30">
                    <div className="min-w-0 flex-1">
                      <label className="text-sm font-medium text-foreground block truncate">Guidance</label>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">Show help text</p>
                    </div>
                    <Switch
                      checked={action.guidanceEnabled}
                      disabled
                      className="opacity-60"
                    />
                  </div>
                )}

                {/* Time Range Display */}
                <div className="p-3 rounded-md border border-border bg-muted/30">
                  <label className="text-sm font-medium text-foreground block mb-1.5">Deadline</label>
                  <div className="text-xs text-muted-foreground">
                    {action.timeRange.type === 'NONE' && 'No deadline'}
                    {action.timeRange.type === 'ABSOLUTE' &&
                      `${action.timeRange.durationDays} day${action.timeRange.durationDays !== 1 ? 's' : ''} from start`}
                    {action.timeRange.type === 'WITH_PREVIOUS' &&
                      `${action.timeRange.offsetDays} day${action.timeRange.offsetDays !== 1 ? 's' : ''} after previous`}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reminders Section - Read-only, collapsible - Always visible if reminders exist */}
        {action.reminders.length > 0 && (
          <div className="px-4 py-3 border-t border-border">
            <button
              onClick={() => setIsRemindersExpanded(!isRemindersExpanded)}
              className="w-full flex items-center justify-between text-sm font-medium text-foreground hover:text-primary transition-colors py-1 group"
              aria-label={isRemindersExpanded ? 'Collapse reminders' : 'Expand reminders'}
              aria-expanded={isRemindersExpanded}
            >
              <span className="flex items-center gap-2.5">
                <Bell className={`h-4 w-4 transition-colors ${isRemindersExpanded ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} aria-hidden="true" />
                <span>Reminders</span>
                <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">({action.reminders.length})</span>
                {!isRemindersExpanded && action.reminders.length > 0 && (
                  <span className="text-xs text-muted-foreground font-normal ml-1 truncate max-w-[200px]">
                    • {action.reminders.length === 1 
                      ? (() => {
                          const r = action.reminders[0];
                          const channel = r.channel === 'PUSH' ? 'Push' : r.channel === 'EMAIL' ? 'Email' : r.channel === 'TRAINER' ? 'Trainer' : 'Webhook';
                          const freq = r.frequencyType === 'ONCE' ? 'Once' : `${r.frequencyDays || 3}d`;
                          return `${channel} ${freq}`;
                        })()
                      : `${action.reminders.length} configured`}
                  </span>
                )}
              </span>
              {isRemindersExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              )}
            </button>

            {isRemindersExpanded && (
              <div className="mt-3 pt-3 border-t border-border space-y-2">
                {action.reminders.map((reminder, index) => {
                  const channelLabel = reminder.channel === 'PUSH' ? 'Push Notification' : 
                                      reminder.channel === 'EMAIL' ? 'Email' : 
                                      reminder.channel === 'TRAINER' ? 'Trainer Task' : 'Webhook';
                  const frequencyLabel = reminder.frequencyType === 'ONCE' ? 'Once' : 
                                        `Every ${reminder.frequencyDays || 3} days`;
                  
                  return (
                    <div key={reminder.id} className="p-2.5 rounded-md border border-border bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Bell className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                          <span className="text-xs font-medium text-foreground">Reminder {index + 1}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Channel:</span>
                          <span className="ml-1.5 text-foreground">{channelLabel}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Frequency:</span>
                          <span className="ml-1.5 text-foreground">{frequencyLabel}</span>
                        </div>
                      </div>
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


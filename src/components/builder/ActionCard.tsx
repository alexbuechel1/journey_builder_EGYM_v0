import { useState } from 'react';
import type { Action } from '@/lib/types';
import { getActionLibraryItem } from '@/lib/actionLibrary';
import { getProductInfo } from '@/lib/productMapping';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Zap, Edit2, Trash2, GripVertical, Bell, Settings, Eye, EyeOff, BookCheck, BookX, Clock, Vibrate, Mail, UserStar, Webhook, ChevronDown, ChevronUp } from 'lucide-react';
import type { ReminderChannel } from '@/lib/types';

interface ActionCardProps {
  action: Action;
  isEntryAction: boolean;
  onEdit: () => void;
  onDelete: () => void;
  dragHandleProps?: any;
  expandState?: 'collapsed' | 'expanded' | 'fully-expanded';
}

export function ActionCard({
  action,
  isEntryAction,
  onEdit,
  onDelete,
  dragHandleProps,
  expandState = 'expanded',
}: ActionCardProps) {
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);
  const [isRemindersExpanded, setIsRemindersExpanded] = useState(false);
  const libraryItem = getActionLibraryItem(action.actionTypeId);
  const title = libraryItem?.title || action.actionTypeId;
  const productInfo = getProductInfo(action.product);
  
  // Determine if sections should be expanded based on expandState
  const isCollapsed = expandState === 'collapsed';
  const isFullyExpanded = expandState === 'fully-expanded';
  const shouldShowConfigExpanded = isFullyExpanded || isConfigExpanded;
  const shouldShowRemindersExpanded = isFullyExpanded || isRemindersExpanded;
  
  const getTimeRangeLabel = () => {
    if (action.timeRange.type === 'NONE') return 'No deadline';
    if (action.timeRange.type === 'ABSOLUTE') {
      return `${action.timeRange.durationDays} day${action.timeRange.durationDays !== 1 ? 's' : ''} from start`;
    }
    return `${action.timeRange.offsetDays} day${action.timeRange.offsetDays !== 1 ? 's' : ''} after previous`;
  };

  const getChannelIcon = (channel: ReminderChannel) => {
    switch (channel) {
      case 'PUSH':
        return Vibrate;
      case 'EMAIL':
        return Mail;
      case 'TRAINER':
        return UserStar;
      case 'WEBHOOK':
        return Webhook;
      default:
        return Bell;
    }
  };

  return (
    <TooltipProvider>
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
        <div className={`px-4 py-3 ${isCollapsed ? '' : 'border-b border-border'} bg-muted/30`}>
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
                {action.completionMode === 'COUNTER' && action.requiredCount && action.requiredCount >= 2 ? (
                  <div className="flex-shrink-0 w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      {action.requiredCount}x
                    </span>
                  </div>
                ) : (
                  <div className="flex-shrink-0 w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                    <Zap className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  </div>
                )}
                <div className="flex items-center gap-2 flex-1 min-w-0">
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

        {/* Content Sections - Only show when not collapsed */}
        {!isCollapsed && (
          <>

        {/* Configuration Options - Collapsible, read-only */}
        <div className="px-4 py-3 border-t border-border">
          <button
            onClick={() => setIsConfigExpanded(!isConfigExpanded)}
            disabled={isFullyExpanded}
            className="w-full flex items-center justify-between gap-2.5 mb-3 group disabled:opacity-50 disabled:cursor-default"
            aria-label={shouldShowConfigExpanded ? 'Collapse configuration' : 'Expand configuration'}
            aria-expanded={shouldShowConfigExpanded}
          >
            <div className="flex items-center gap-2.5 flex-wrap">
              <Settings className="h-4 w-4 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground">Configuration</span>
              {!shouldShowConfigExpanded && (
                <>
                  {/* Product icon - First */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center cursor-help">
                        <img src={productInfo.icon} alt={productInfo.label} className="w-full h-full" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{productInfo.label}</p>
                    </TooltipContent>
                  </Tooltip>
                  {/* Visibility icon - Second */}
                  {action.visibleInChecklist ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-help">
                          <Eye className="h-4 w-4 text-foreground flex-shrink-0" aria-hidden="true" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Visible for user</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-help">
                          <EyeOff className="h-4 w-4 text-red-400 flex-shrink-0" aria-hidden="true" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Hidden from user</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {/* Guidance icon - Third (only if supported) */}
                  {action.supportsGuidance && (
                    action.guidanceEnabled ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-help">
                            <BookCheck className="h-4 w-4 text-foreground flex-shrink-0" aria-hidden="true" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Guidance enabled</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-help">
                            <BookX className="h-4 w-4 text-red-400 flex-shrink-0" aria-hidden="true" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Guidance disabled</p>
                        </TooltipContent>
                      </Tooltip>
                    )
                  )}
                </>
              )}
            </div>
            {shouldShowConfigExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
            )}
          </button>

          {shouldShowConfigExpanded && (
            <div className="flex flex-col gap-2">
              {/* Product - First */}
              <div className="flex items-center gap-2.5 p-2.5 rounded-md border border-border bg-muted/30">
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  <img src={productInfo.icon} alt={productInfo.label} className="w-full h-full" />
                </div>
                <span className="text-sm font-medium text-foreground">{productInfo.label}</span>
              </div>

              {/* Visibility - Second */}
              <div className="flex items-center gap-2.5 p-2.5 rounded-md border border-border bg-muted/30">
                {action.visibleInChecklist ? (
                  <Eye className="h-4 w-4 text-foreground flex-shrink-0" aria-hidden="true" />
                ) : (
                  <EyeOff className="h-4 w-4 text-red-400 flex-shrink-0" aria-hidden="true" />
                )}
                <span className="text-sm font-medium text-foreground">
                  {action.visibleInChecklist ? 'Visible for user' : 'Hidden from user'}
                </span>
              </div>

              {/* Guidance - Third (only if supported) */}
              {action.supportsGuidance && (
                <div className="flex items-center gap-2.5 p-2.5 rounded-md border border-border bg-muted/30">
                  {action.guidanceEnabled ? (
                    <BookCheck className="h-4 w-4 text-foreground flex-shrink-0" aria-hidden="true" />
                  ) : (
                    <BookX className="h-4 w-4 text-red-400 flex-shrink-0" aria-hidden="true" />
                  )}
                  <span className="text-sm font-medium text-foreground">
                    {action.guidanceEnabled ? 'Guidance enabled' : 'Guidance disabled'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Time Range Section - Only show when no reminders exist */}
        {action.reminders.length === 0 && (
          <div className="px-4 py-3 border-t border-border">
            <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-border" style={{ backgroundColor: '#f6ffdb' }}>
              <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground">{getTimeRangeLabel()}</span>
            </div>
          </div>
        )}

        {/* Reminders Section - Only visible if reminders exist */}
        {action.reminders.length > 0 && (
          <div className="px-4 py-3 border-t border-border">
            <button
              onClick={() => setIsRemindersExpanded(!isRemindersExpanded)}
              disabled={isFullyExpanded}
              className="w-full flex items-center justify-between gap-2.5 mb-3 flex-wrap group disabled:opacity-50 disabled:cursor-default"
              aria-label={shouldShowRemindersExpanded ? 'Collapse reminders' : 'Expand reminders'}
              aria-expanded={shouldShowRemindersExpanded}
            >
              <div className="flex items-center gap-2.5 flex-wrap">
                <Bell className="h-4 w-4 text-primary" aria-hidden="true" />
                <span className="text-sm font-medium text-foreground">Reminders</span>
                <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">({action.reminders.length})</span>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground px-1.5 py-0.5 rounded" style={{ backgroundColor: '#f6ffdb' }}>
                  <Clock className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                  {getTimeRangeLabel()}
                </span>
              </div>
              {shouldShowRemindersExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
              )}
            </button>

            {shouldShowRemindersExpanded && (
              <div className="space-y-2">
                {action.reminders.map((reminder, index) => {
                  const channelLabel = reminder.channel === 'PUSH' ? 'Push Notification' : 
                                      reminder.channel === 'EMAIL' ? 'Email' : 
                                      reminder.channel === 'TRAINER' ? 'Trainer Task' : 'Webhook';
                  const frequencyLabel = reminder.frequencyType === 'ONCE' ? 'Once' : 
                                        `Every ${reminder.frequencyDays || 3} days`;
                  const ChannelIcon = getChannelIcon(reminder.channel);
                  
                  return (
                    <div key={reminder.id} className="p-2.5 rounded-md border border-border bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <ChannelIcon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
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
          </>
        )}
      </Card>
      </div>
    </TooltipProvider>
  );
}


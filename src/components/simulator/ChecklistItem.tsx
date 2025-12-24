import { format, formatDistanceToNow } from 'date-fns';
import type { ActionInstance } from '@/lib/types';
import { getActionLibraryItem } from '@/lib/actionLibrary';
import { CheckCircle2, Circle, Clock, AlertCircle, Info, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChecklistItemProps {
  actionInstance: ActionInstance;
}

export function ChecklistItem({ actionInstance }: ChecklistItemProps) {
  const actionLibraryItem = getActionLibraryItem(actionInstance.actionTypeId);
  const title = actionLibraryItem?.title || 'Unknown Action';

  // Status indicator
  const getStatusConfig = () => {
    switch (actionInstance.status) {
      case 'DONE':
        return {
          icon: CheckCircle2,
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          label: 'Completed',
          badgeColor: 'bg-success/10 text-success border-success/20',
        };
      case 'IN_PROGRESS':
        return {
          icon: Clock,
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          label: 'In Progress',
          badgeColor: 'bg-warning/10 text-warning border-warning/20',
        };
      case 'OVERDUE':
        return {
          icon: AlertCircle,
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive/20',
          label: 'Overdue',
          badgeColor: 'bg-destructive/10 text-destructive border-destructive/20',
        };
      default:
        return {
          icon: Circle,
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/10',
          borderColor: 'border-input',
          label: 'Not Started',
          badgeColor: 'bg-muted/10 text-muted-foreground border-input',
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;
  const isCounter = actionInstance.completionMode === 'COUNTER';
  const progressPercentage = isCounter && actionInstance.requiredCount
    ? Math.min(100, Math.round((actionInstance.currentCount / actionInstance.requiredCount) * 100))
    : actionInstance.status === 'DONE' ? 100 : 0;

  return (
    <div
      className={cn(
        'rounded-xl border-2 bg-background p-4 transition-all hover:shadow-md',
        statusConfig.borderColor
      )}
    >
      <div className="flex items-start gap-4">
        {/* Status Icon */}
        <div
          className={cn(
            'mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
            statusConfig.bgColor,
            statusConfig.color
          )}
        >
          <StatusIcon className="h-6 w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Title and Guidance */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-body-100 font-medium text-foreground leading-tight">
                  {title}
                </h4>
                {actionInstance.guidanceEnabled && (
                  <div className="p-1 bg-primary/10 rounded">
                    <Info className="h-3.5 w-3.5 text-primary shrink-0" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar for COUNTER actions */}
          {isCounter && actionInstance.requiredCount && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-body-50 font-medium text-foreground">
                    {actionInstance.currentCount} / {actionInstance.requiredCount}
                  </span>
                </div>
                <span className="text-marginal-25 text-muted-foreground">
                  {progressPercentage}%
                </span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all duration-300 rounded-full',
                    actionInstance.status === 'DONE'
                      ? 'bg-success'
                      : actionInstance.status === 'OVERDUE'
                      ? 'bg-destructive'
                      : 'bg-warning'
                  )}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Deadline */}
          {actionInstance.deadline && (
            <div className="flex items-center gap-2">
              <Clock className={cn(
                'h-3.5 w-3.5',
                actionInstance.status === 'OVERDUE'
                  ? 'text-destructive'
                  : 'text-muted-foreground'
              )} />
              <span
                className={cn(
                  'text-body-50',
                  actionInstance.status === 'OVERDUE'
                    ? 'text-destructive font-medium'
                    : 'text-muted-foreground'
                )}
              >
                {actionInstance.status === 'OVERDUE' ? 'Overdue' : 'Due'}:{' '}
                {formatDistanceToNow(actionInstance.deadline, { addSuffix: true })}
              </span>
              <span className="text-marginal-25 text-muted-foreground">
                ({format(actionInstance.deadline, 'MMM d, yyyy')})
              </span>
            </div>
          )}

          {/* Status Badge */}
          <div className="flex items-center gap-2 pt-1">
            <span
              className={cn(
                'inline-flex items-center px-2.5 py-1 rounded-md text-marginal-25 font-medium border',
                statusConfig.badgeColor
              )}
            >
              {statusConfig.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


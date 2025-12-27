import { useState } from 'react';
import type { Action } from '@/lib/types';
import { getActionLibraryItem } from '@/lib/actionLibrary';
import { getProductInfo } from '@/lib/productMapping';
import { formatTimeFrame, formatProgress, calculateProgressPercentage, getActionStatus, calculateDeadline } from '@/lib/checklistUtils';
import { differenceInDays } from 'date-fns';
import { ChevronDown, ChevronUp, CheckCircle2, Clock, AlertCircle, Circle, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ChecklistItemProps {
  action: Action;
  entryCompletedAt?: Date;
  previousActionCompletedAt?: Date;
  currentCount?: number;
  completedAt?: Date;
  currentTime?: Date;
  stepNumber?: number;
  isLast?: boolean;
  showConnector?: boolean;
}

export function ChecklistItem({
  action,
  entryCompletedAt,
  previousActionCompletedAt,
  currentCount = 0,
  completedAt,
  currentTime = new Date(),
  stepNumber,
  isLast = false,
  showConnector = true,
}: ChecklistItemProps) {
  const [isGuidanceExpanded, setIsGuidanceExpanded] = useState(false);
  
  const libraryItem = getActionLibraryItem(action.actionTypeId);
  const title = libraryItem?.title || action.actionTypeId;
  const productInfo = getProductInfo(action.product);
  
  // Calculate deadline
  const deadline = calculateDeadline(
    action,
    entryCompletedAt || new Date(),
    previousActionCompletedAt
  );
  
  // Get status
  const status = getActionStatus(action, deadline, currentTime, completedAt, currentCount);
  
  // Format time frame
  const timeFrameText = formatTimeFrame(
    action,
    deadline,
    entryCompletedAt,
    previousActionCompletedAt,
    currentTime
  );
  
  // Calculate deadline urgency for color coding
  const getDeadlineUrgency = () => {
    if (!deadline || action.timeRange.type === 'NONE') return null;
    
    const daysDiff = differenceInDays(deadline, currentTime);
    
    if (daysDiff < 0) {
      return 'overdue'; // Overdue - red
    } else if (daysDiff <= 3) {
      return 'urgent'; // Due soon (0-3 days) - amber/warning
    } else if (daysDiff <= 7) {
      return 'soon'; // Due soon (4-7 days) - muted warning
    }
    return 'normal'; // Normal - default
  };
  
  const deadlineUrgency = getDeadlineUrgency();
  
  // Get deadline color based on urgency
  const getDeadlineColor = () => {
    switch (deadlineUrgency) {
      case 'overdue':
        return 'text-destructive';
      case 'urgent':
        return 'text-warning';
      case 'soon':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };
  
  // Status styling - using design system semantic colors
  const getStatusConfig = () => {
    switch (status) {
      case 'DONE':
        return {
          icon: CheckCircle2,
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          label: 'Done',
        };
      case 'IN_PROGRESS':
        return {
          icon: Clock,
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          label: 'In Progress',
        };
      case 'OVERDUE':
        return {
          icon: AlertCircle,
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive/20',
          label: 'Overdue',
        };
      default:
        return {
          icon: Circle,
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/30',
          borderColor: 'border-border',
          label: 'Not Done',
        };
    }
  };
  
  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;
  
  // Progress for counter actions - only show if requiredCount > 1
  const showProgress = action.completionMode === 'COUNTER' && action.requiredCount !== undefined && action.requiredCount > 1;
  const progressPercentage = showProgress && action.requiredCount !== undefined
    ? calculateProgressPercentage(currentCount, action.requiredCount)
    : 0;
  const progressText = showProgress && action.requiredCount !== undefined
    ? formatProgress(currentCount, action.requiredCount)
    : '';
  
  return (
    <div className="relative">
      <Card className={`p-12x border ${statusConfig.borderColor} ${statusConfig.bgColor} transition-colors card-shadow`}>
        <div className="flex items-start gap-3" role="region" aria-labelledby={`action-title-${action.id}`}>
          {/* Step Number Badge with Connector - Shows checkmark when done */}
          <div className="flex flex-col items-center">
            {stepNumber !== undefined && (
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground relative z-10" aria-label={`Step ${stepNumber}, Status: ${statusConfig.label}`}>
                {status === 'DONE' ? (
                  <Check className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <span className="text-body-50-bold font-bold">{stepNumber}</span>
                )}
              </div>
            )}
            {/* Connector Line */}
            {showConnector && !isLast && (
              <div className={`w-0.5 h-12x mt-2 ${status === 'DONE' ? 'bg-primary' : 'bg-border'}`} aria-hidden="true" />
            )}
          </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h3 id={`action-title-${action.id}`} className="text-body-100-medium font-medium text-foreground mb-1">
                {title}
              </h3>
              
              {/* Product Badge */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  <img
                    src={productInfo.icon}
                    alt={productInfo.label}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-marginal-25 text-muted-foreground">
                  {productInfo.label}
                </span>
              </div>
            </div>
            
            {/* Status Badge with Icon - Enhanced prominence */}
            <div className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md ${statusConfig.bgColor} border ${statusConfig.borderColor}`} aria-label={`Status: ${statusConfig.label}`}>
              <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} aria-hidden="true" />
              <span className={`text-body-50-bold ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>
          </div>
          
          {/* Progress Bar for Counter Actions */}
          {showProgress && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-body-50 text-muted-foreground">
                  {progressText}
                </span>
                <span className="text-body-50 text-muted-foreground">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    status === 'DONE'
                      ? 'bg-success'
                      : status === 'OVERDUE'
                      ? 'bg-destructive'
                      : 'bg-primary'
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                  role="progressbar"
                  aria-valuenow={currentCount}
                  aria-valuemin={0}
                  aria-valuemax={action.requiredCount || 0}
                  aria-label={`Progress: ${progressText}`}
                />
              </div>
            </div>
          )}
          
          {/* Time Frame with Urgency Indicator */}
          {action.timeRange.type !== 'NONE' && (
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <Clock className={`h-4 w-4 ${getDeadlineColor()}`} aria-hidden="true" />
                <span className={`text-body-50-bold ${getDeadlineColor()}`}>
                  {timeFrameText}
                </span>
              </div>
            </div>
          )}
          
          {/* Guidance Section (Expandable) */}
          {action.guidanceEnabled && action.supportsGuidance && (
            <div className="mt-3 border-t border-border pt-3">
              <button
                onClick={() => setIsGuidanceExpanded(!isGuidanceExpanded)}
                className="flex items-center justify-between w-full text-left hover:opacity-80 transition-opacity min-h-[44px] min-w-[44px]"
                aria-expanded={isGuidanceExpanded}
                aria-label={isGuidanceExpanded ? `Collapse guidance for ${title}` : `Expand guidance for ${title}`}
              >
                <span className="text-body-50-bold text-foreground">
                  Guidance
                </span>
                {isGuidanceExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                )}
              </button>
              
              {isGuidanceExpanded && (
                <div className="mt-2 p-3 bg-card rounded-md border border-border">
                  <p className="text-body-100 text-muted-foreground">
                    Guidance content will be displayed here. This is a placeholder for future implementation.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
    </div>
  );
}


import { useState } from 'react';
import type { Action } from '@/lib/types';
import { getActionLibraryItem } from '@/lib/actionLibrary';
import { getProductInfo } from '@/lib/productMapping';
import { formatTimeFrame, formatProgress, calculateProgressPercentage, getActionStatus, calculateDeadline } from '@/lib/checklistUtils';
import { ChevronDown, ChevronUp, CheckCircle2, Clock, AlertCircle, Circle } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ChecklistItemProps {
  action: Action;
  entryCompletedAt?: Date;
  previousActionCompletedAt?: Date;
  currentCount?: number;
  completedAt?: Date;
  currentTime?: Date;
}

export function ChecklistItem({
  action,
  entryCompletedAt,
  previousActionCompletedAt,
  currentCount = 0,
  completedAt,
  currentTime = new Date(),
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
  
  // Status styling
  const getStatusConfig = () => {
    switch (status) {
      case 'DONE':
        return {
          icon: CheckCircle2,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          label: 'Done',
        };
      case 'IN_PROGRESS':
        return {
          icon: Clock,
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          label: 'In Progress',
        };
      case 'OVERDUE':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
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
  
  // Progress for counter actions
  const showProgress = action.completionMode === 'COUNTER' && action.requiredCount !== undefined;
  const progressPercentage = showProgress && action.requiredCount !== undefined
    ? calculateProgressPercentage(currentCount, action.requiredCount)
    : 0;
  const progressText = showProgress && action.requiredCount !== undefined
    ? formatProgress(currentCount, action.requiredCount)
    : '';
  
  return (
    <Card className={`p-4 border ${statusConfig.borderColor} ${statusConfig.bgColor} transition-colors`}>
      <div className="flex items-start gap-3">
        {/* Status Icon */}
        <div className={`flex-shrink-0 mt-0.5 ${statusConfig.color}`}>
          <StatusIcon className="h-5 w-5" aria-hidden="true" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-body-100-medium font-medium text-foreground mb-1">
                {title}
              </h3>
              
              {/* Product Badge */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
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
            
            {/* Status Badge */}
            <div className={`flex-shrink-0 px-2 py-1 rounded-md ${statusConfig.bgColor} border ${statusConfig.borderColor}`}>
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
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    status === 'DONE'
                      ? 'bg-green-600'
                      : status === 'OVERDUE'
                      ? 'bg-red-600'
                      : 'bg-primary'
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                  role="progressbar"
                  aria-valuenow={currentCount}
                  aria-valuemin={0}
                  aria-valuemax={action.requiredCount || 0}
                />
              </div>
            </div>
          )}
          
          {/* Time Frame */}
          {action.timeRange.type !== 'NONE' && (
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-body-50 text-muted-foreground">
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
                className="flex items-center justify-between w-full text-left hover:opacity-80 transition-opacity"
                aria-expanded={isGuidanceExpanded}
                aria-label={isGuidanceExpanded ? 'Collapse guidance' : 'Expand guidance'}
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
  );
}


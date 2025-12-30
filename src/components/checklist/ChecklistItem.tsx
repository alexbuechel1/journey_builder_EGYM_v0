import { useState } from 'react';
import type { Action } from '@/lib/types';
import { getActionLibraryItem } from '@/lib/actionLibrary';
import { getProductInfo } from '@/lib/productMapping';
import { formatTimeFrame, formatProgress, calculateProgressPercentage, getActionStatus, calculateDeadline } from '@/lib/checklistUtils';
import { renderGuidanceContent } from '@/lib/guidanceContent';
import { format } from 'date-fns';
import { CheckCircle2, Clock, AlertCircle, Circle, Check, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const description = libraryItem?.description || '';
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
  
  // Status styling - simplified for lightweight design
  const getStatusConfig = () => {
    switch (status) {
      case 'DONE':
        return {
          icon: CheckCircle2,
          color: 'text-primary',
          bgColor: 'bg-primary',
          label: 'Done!',
          showCTA: false,
          showLabel: false, // Don't show "Done!" label
        };
      case 'IN_PROGRESS':
        return {
          icon: Clock,
          color: 'text-warning',
          bgColor: 'bg-warning',
          label: 'In Progress',
          showCTA: false,
          showLabel: true,
        };
      case 'OVERDUE':
        return {
          icon: AlertCircle,
          color: 'text-destructive',
          bgColor: 'bg-destructive',
          label: 'Overdue',
          showCTA: false,
          showLabel: true,
        };
      default:
        return {
          icon: Circle,
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          label: 'Waiting',
          showCTA: action.guidanceEnabled && action.supportsGuidance,
          showLabel: action.guidanceEnabled && action.supportsGuidance, // Only show "Waiting" if there's guidance
        };
    }
  };
  
  const statusConfig = getStatusConfig();
  
  // Progress for counter actions - only show if requiredCount > 1
  const showProgress = action.completionMode === 'COUNTER' && action.requiredCount !== undefined && action.requiredCount > 1;
  const progressPercentage = showProgress && action.requiredCount !== undefined
    ? calculateProgressPercentage(currentCount, action.requiredCount)
    : 0;
  const progressText = showProgress && action.requiredCount !== undefined
    ? formatProgress(currentCount, action.requiredCount)
    : '';
  
  return (
    <div className="relative flex items-start gap-4" role="region" aria-labelledby={`action-title-${action.id}`}>
      {/* Connector Line - extends through expanded guidance, positioned relative to entire item */}
      {showConnector && !isLast && (
        <div 
          className={`absolute top-10 left-5 w-0.5 ${
            status === 'DONE' ? 'bg-primary' : 'bg-border'
          }`}
          style={{ 
            bottom: 0,
            minHeight: '60px'
          }}
          aria-hidden="true" 
        />
      )}
      
      {/* Step Number Badge */}
      <div className="flex flex-col items-center flex-shrink-0 relative z-10">
        {stepNumber !== undefined && (
          <div 
            className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full ${
              status === 'DONE' 
                ? 'bg-success text-white' 
                : 'bg-muted text-muted-foreground'
            }`}
            aria-label={`Step ${stepNumber}, Status: ${statusConfig.label}`}
          >
            {status === 'DONE' ? (
              <Check className="h-5 w-5 text-white" aria-hidden="true" />
            ) : (
              <span className="text-body-100-medium font-medium">{stepNumber}</span>
            )}
          </div>
        )}
      </div>
    
      {/* Content - Lightweight, no card */}
      <div className="flex-1 min-w-0 pb-8">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 
                id={`action-title-${action.id}`} 
                className={`text-body-100-medium font-medium text-foreground ${
                  status === 'DONE' ? 'line-through text-muted-foreground' : ''
                }`}
              >
                {title}
              </h3>
              
              {/* Time info inline badge - show completion date when done, deadline when not done */}
              {status === 'DONE' && completedAt ? (
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success/10">
                  <Calendar className="h-3 w-3 text-success" aria-hidden="true" />
                  <span className="text-body-50 text-success">
                    Completed {format(completedAt, 'MMM d, yyyy')}
                  </span>
                </div>
              ) : action.timeRange.type !== 'NONE' && deadline ? (
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-wellpass/5">
                  <Calendar className="h-3 w-3 text-wellpass opacity-80" aria-hidden="true" />
                  <span className="text-body-50 text-wellpass opacity-80">
                    {timeFrameText}
                  </span>
                </div>
              ) : null}
            </div>
            
            {/* Description/Subheadline */}
            {description && (
              <p className={`text-body-100 text-muted-foreground mb-3 ${
                status === 'DONE' ? 'line-through' : ''
              }`}>
                {description}
              </p>
            )}
          </div>
          
          {/* Status Badge or CTA Button with Time Info Integration (Option 3) */}
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            {statusConfig.showCTA ? (
              <Button
                onClick={() => setIsGuidanceExpanded(!isGuidanceExpanded)}
                variant="default"
                size="default"
                aria-label={`See how to ${title}`}
              >
                See How
              </Button>
            ) : statusConfig.showLabel ? (
              <div className={`px-3 py-1.5 rounded-md ${status === 'DONE' ? 'text-primary' : 'text-muted-foreground'}`} aria-label={`Status: ${statusConfig.label}`}>
                <span className={`text-body-100-medium font-medium`}>
                  {statusConfig.label}
                </span>
              </div>
            ) : null}
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
                    ? 'bg-primary'
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
        
        {/* Guidance Section (Expandable) - Product info moved here */}
        {isGuidanceExpanded && action.guidanceEnabled && action.supportsGuidance && (
          <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border">
            {/* Product Info in Guidance */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                <img
                  src={productInfo.icon}
                  alt={productInfo.label}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-body-50 text-muted-foreground">
                {productInfo.label}
              </span>
            </div>
            
            {/* Render specific guidance content based on action/product */}
            {renderGuidanceContent({ action })}
          </div>
        )}
      </div>
    </div>
  );
}

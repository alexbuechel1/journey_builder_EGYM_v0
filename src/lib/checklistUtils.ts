import { addDays, format, differenceInDays, differenceInHours } from 'date-fns';
import type { Action, ActionStatus } from './types';

/**
 * Calculate deadline date for an action
 */
export function calculateDeadline(
  action: Action,
  entryCompletedAt: Date,
  previousActionCompletedAt?: Date
): Date | null {
  if (action.timeRange.type === 'NONE') return null;
  
  if (action.timeRange.type === 'ABSOLUTE') {
    const durationDays = action.timeRange.durationDays || 0;
    return addDays(entryCompletedAt, durationDays);
  }
  
  if (action.timeRange.type === 'WITH_PREVIOUS') {
    if (!previousActionCompletedAt) return null;
    const offsetDays = action.timeRange.offsetDays || 0;
    return addDays(previousActionCompletedAt, offsetDays);
  }
  
  return null;
}

/**
 * Get action status (simplified for read-only checklist)
 * Since we don't have event data, we'll show NOT_DONE for all actions
 * This can be enhanced later when simulation is added
 */
export function getActionStatus(
  action: Action,
  deadline: Date | null,
  currentTime: Date = new Date(),
  completedAt?: Date,
  currentCount?: number
): ActionStatus {
  if (completedAt) return 'DONE';
  
  if (action.completionMode === 'COUNTER' && currentCount !== undefined) {
    if (currentCount > 0 && action.requiredCount && currentCount < action.requiredCount) {
      return 'IN_PROGRESS';
    }
    if (action.requiredCount && currentCount >= action.requiredCount) {
      return 'DONE';
    }
  }
  
  if (deadline && currentTime > deadline) {
    return 'OVERDUE';
  }
  
  return 'NOT_DONE';
}

/**
 * Format time frame for display
 * Returns human-readable deadline information
 */
export function formatTimeFrame(
  action: Action,
  deadline: Date | null,
  _entryCompletedAt?: Date,
  _previousActionCompletedAt?: Date,
  currentTime: Date = new Date()
): string {
  if (action.timeRange.type === 'NONE') {
    return 'No deadline';
  }
  
  if (!deadline) {
    // WITH_PREVIOUS without previous completion
    return 'Pending previous action';
  }
  
  const daysDiff = differenceInDays(deadline, currentTime);
  const hoursDiff = differenceInHours(deadline, currentTime);
  
  if (daysDiff < 0) {
    // Overdue
    const overdueDays = Math.abs(daysDiff);
    if (overdueDays === 1) {
      return 'Overdue by 1 day';
    }
    return `Overdue by ${overdueDays} days`;
  }
  
  if (daysDiff === 0) {
    if (hoursDiff < 0) {
      return 'Overdue';
    }
    if (hoursDiff <= 12) {
      return 'Due today';
    }
    return 'Due today';
  }
  
  if (daysDiff === 1) {
    return 'Due in 1 day';
  }
  
  if (daysDiff <= 7) {
    return `Due in ${daysDiff} days`;
  }
  
  if (daysDiff <= 30) {
    const weeks = Math.floor(daysDiff / 7);
    const remainingDays = daysDiff % 7;
    if (remainingDays === 0) {
      return weeks === 1 ? 'Due in 1 week' : `Due in ${weeks} weeks`;
    }
    return `Due in ${weeks} week${weeks > 1 ? 's' : ''} and ${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
  }
  
  // Format as date for longer deadlines
  return `Due: ${format(deadline, 'MMM d, yyyy')}`;
}

/**
 * Format progress text for counter actions
 */
export function formatProgress(currentCount: number, requiredCount: number): string {
  return `${currentCount} of ${requiredCount}`;
}

/**
 * Calculate progress percentage for counter actions
 */
export function calculateProgressPercentage(currentCount: number, requiredCount: number): number {
  return Math.min(Math.max((currentCount / requiredCount) * 100, 0), 100);
}


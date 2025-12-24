import { addDays } from 'date-fns';
import type { Action, ActionInstance, ActionStatus } from './types';

/**
 * Calculate the deadline for an action based on its time range configuration
 * @param action - The action to calculate deadline for
 * @param entryCompletedAt - When the entry action (journey anchor) was completed
 * @param previousActionCompletedAt - When the previous action was completed (for WITH_PREVIOUS)
 * @returns The deadline date, or null if no deadline applies
 */
export function calculateDeadline(
  action: Action,
  entryCompletedAt: Date,
  previousActionCompletedAt?: Date
): Date | null {
  if (action.timeRange.type === 'NONE') return null;
  
  if (action.timeRange.type === 'ABSOLUTE') {
    if (!action.timeRange.durationDays) return null;
    return addDays(entryCompletedAt, action.timeRange.durationDays);
  }
  
  if (action.timeRange.type === 'WITH_PREVIOUS') {
    if (!previousActionCompletedAt || !action.timeRange.offsetDays) return null;
    return addDays(previousActionCompletedAt, action.timeRange.offsetDays);
  }
  
  return null;
}

/**
 * Calculate the current status of an action instance
 * @param action - The action instance to evaluate
 * @param currentTime - The current simulated time
 * @returns The action status
 */
export function calculateActionStatus(
  action: ActionInstance,
  currentTime: Date
): ActionStatus {
  // If already completed, always return DONE
  if (action.completedAt) return 'DONE';
  
  // For COUNTER actions, check if in progress
  if (action.completionMode === 'COUNTER' && action.currentCount > 0) {
    if (action.requiredCount && action.currentCount < action.requiredCount) {
      // Check if overdue
      if (action.deadline && currentTime > action.deadline) {
        return 'OVERDUE';
      }
      return 'IN_PROGRESS';
    }
    // If count reached required, should be DONE (but completedAt not set yet)
    // This shouldn't happen in normal flow, but handle gracefully
    if (action.requiredCount && action.currentCount >= action.requiredCount) {
      return 'DONE';
    }
  }
  
  // Check if overdue
  if (action.deadline && currentTime > action.deadline) {
    return 'OVERDUE';
  }
  
  return 'NOT_DONE';
}


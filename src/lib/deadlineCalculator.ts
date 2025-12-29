import type { Action, ActionInstance, ActionStatus } from './types';
import { calculateDeadline as calculateDeadlineFromUtils } from './checklistUtils';
import { getActionStatus } from './checklistUtils';

/**
 * Calculate deadline for an action instance
 * Re-exports from checklistUtils for compatibility
 */
export function calculateDeadline(
  action: Action | ActionInstance,
  entryCompletedAt: Date,
  previousActionCompletedAt?: Date
): Date | null {
  return calculateDeadlineFromUtils(action, entryCompletedAt, previousActionCompletedAt);
}

/**
 * Calculate action status based on deadline and current time
 */
export function calculateActionStatus(
  actionInstance: ActionInstance,
  currentTime: Date
): ActionStatus {
  return getActionStatus(
    actionInstance,
    actionInstance.deadline || null,
    currentTime,
    actionInstance.completedAt,
    actionInstance.currentCount
  );
}

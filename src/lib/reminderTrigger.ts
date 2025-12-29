import type { ActionInstance, Notification } from './types';

/**
 * Check if reminders should be triggered for an action
 * Returns array of notifications to send
 */
export function checkReminders(
  _actionInstance: ActionInstance,
  _currentTime: Date,
  _lastReminderTimes: Record<string, Date> = {}
): Notification[] {
  // Stub implementation - reminders not yet fully implemented
  // This prevents build errors while the feature is being developed
  return [];
}

import { differenceInDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import type { ActionInstance, Notification } from './types';
import { getActionLibraryItem } from './actionLibrary';

/**
 * Create a notification from a reminder and action
 */
function createNotification(
  reminder: ActionInstance['reminders'][0],
  action: ActionInstance
): Notification {
  const actionLibraryItem = getActionLibraryItem(action.actionTypeId);
  const actionTitle = actionLibraryItem?.title || 'Action';
  
  // Generate notification message based on action and reminder channel
  const message = `Reminder: Complete "${actionTitle}"${action.deadline ? ` by ${action.deadline.toLocaleDateString()}` : ''}`;
  
  return {
    id: uuidv4(),
    type: reminder.channel === 'PUSH' ? 'PUSH' : 'EMAIL',
    actionId: action.id,
    actionTitle,
    message,
    timestamp: new Date(),
    read: false,
  };
}

/**
 * Check if reminders should fire for an overdue action
 * @param action - The action instance to check reminders for
 * @param currentTime - The current simulated time
 * @param lastReminderTimes - Map tracking when each reminder was last triggered
 * @returns Array of new notifications to send
 */
export function checkReminders(
  action: ActionInstance,
  currentTime: Date,
  lastReminderTimes: Map<string, Date>
): Notification[] {
  // Only fire reminders for overdue actions
  if (action.status !== 'OVERDUE') return [];
  
  // Must have a deadline to be overdue
  if (!action.deadline) return [];
  
  const notifications: Notification[] = [];
  
  for (const reminder of action.reminders) {
    // Skip silent channels (TRAINER and WEBHOOK don't generate notifications)
    if (reminder.channel === 'TRAINER' || reminder.channel === 'WEBHOOK') {
      continue;
    }
    
    if (reminder.frequencyType === 'ONCE') {
      // ONCE: Fire immediately when overdue, but only once
      const lastTrigger = lastReminderTimes.get(reminder.id);
      if (!lastTrigger) {
        // Fire immediately when overdue
        notifications.push(createNotification(reminder, action));
        lastReminderTimes.set(reminder.id, currentTime);
      }
    } else {
      // EVERY_X_DAYS: Fire immediately when overdue, then every X days
      const lastTrigger = lastReminderTimes.get(reminder.id);
      
      if (!lastTrigger) {
        // First trigger - fire immediately when overdue
        notifications.push(createNotification(reminder, action));
        lastReminderTimes.set(reminder.id, currentTime);
      } else {
        // Check if X days have passed since last trigger
        const daysSinceLastTrigger = differenceInDays(currentTime, lastTrigger);
        if (reminder.frequencyDays && daysSinceLastTrigger >= reminder.frequencyDays) {
          notifications.push(createNotification(reminder, action));
          lastReminderTimes.set(reminder.id, currentTime);
        }
      }
    }
  }
  
  return notifications;
}


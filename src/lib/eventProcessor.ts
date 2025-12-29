import type { Action, ActionInstance, Event, Journey, Notification } from './types';
import { checkReminders } from './reminderTrigger';
import { calculateActionStatus } from './deadlineCalculator';

/**
 * Mark an action as complete
 */
function markActionComplete(
  action: Action,
  completedAt: Date,
  entryCompletedAt?: Date
): ActionInstance {
  return {
    ...action,
    status: 'DONE',
    currentCount: action.completionMode === 'COUNTER' ? (action.requiredCount || 0) : 0,
    completedAt,
    entryActionCompletedAt: entryCompletedAt,
  };
}

/**
 * Increment the count for a COUNTER action
 */
function incrementCount(
  action: ActionInstance,
  occurredAt: Date
): ActionInstance {
  const newCount = action.currentCount + 1;
  const isComplete = action.requiredCount ? newCount >= action.requiredCount : false;
  
  return {
    ...action,
    currentCount: newCount,
    completedAt: isComplete ? occurredAt : undefined,
    status: isComplete ? 'DONE' : calculateActionStatus(
      { ...action, currentCount: newCount },
      occurredAt
    ),
  };
}

/**
 * Check for milestone subsumption - when a COUNTER action reaches a count
 * that satisfies multiple actions with the same eventType
 */
function checkMilestoneSubsumption(
  eventType: string,
  currentCount: number,
  allActions: Action[],
  entryCompletedAt?: Date
): ActionInstance[] {
  const matchingActions = allActions.filter(
    a => a.eventType === eventType && a.completionMode === 'COUNTER'
  );

  return matchingActions
    .filter(a => a.requiredCount && currentCount >= a.requiredCount)
    .map(a => markActionComplete(a, new Date(), entryCompletedAt));
}

/**
 * Process an event and update action instances accordingly
 * @param event - The event that occurred
 * @param journey - The journey containing actions
 * @param currentActionInstances - Current state of action instances
 * @param entryCompletedAt - When the entry action was completed (journey anchor time)
 * @param currentTime - Current simulated time
 * @param lastReminderTimes - Map tracking when reminders were last triggered
 * @returns Updated action instances and new notifications
 */
export function processEvent(
  event: Event,
  journey: Journey,
  currentActionInstances: ActionInstance[],
  entryCompletedAt: Date | undefined,
  currentTime: Date,
  lastReminderTimes: Map<string, Date>
): {
  updatedActions: ActionInstance[];
  newNotifications: Notification[];
} {
  if (!entryCompletedAt) {
    // Journey not started - only process entry action (first action in journey)
    const entryAction = journey.actions[0];
    if (entryAction && 
        entryAction.eventType === event.eventType && 
        entryAction.product === event.product) {
      const completedAction = markActionComplete(entryAction, event.occurredAt, event.occurredAt);
      return {
        updatedActions: [completedAction],
        newNotifications: []
      };
    }
    return { updatedActions: [], newNotifications: [] };
  }

  // Journey started - process all matching actions
  const matchingActions = journey.actions.filter(
    a => a.eventType === event.eventType && a.product === event.product
  );

  if (matchingActions.length === 0) {
    return { updatedActions: [], newNotifications: [] };
  }

  const updatedActions: ActionInstance[] = [];
  const newNotifications: Notification[] = [];

  for (const action of matchingActions) {
    // Find existing action instance or create new one
    let actionInstance = currentActionInstances.find(ai => ai.id === action.id);
    
    if (!actionInstance) {
      // Create new action instance from action
      actionInstance = {
        ...action,
        status: 'NOT_DONE',
        currentCount: 0,
        entryActionCompletedAt: entryCompletedAt,
      };
    }

    // Skip if already completed
    if (actionInstance.completedAt) {
      continue;
    }

    if (action.completionMode === 'COUNTER') {
      const updated = incrementCount(actionInstance, event.occurredAt);
      updatedActions.push(updated);
      
      // Check milestone subsumption - all actions with same eventType
      const subsumed = checkMilestoneSubsumption(
        action.eventType,
        updated.currentCount,
        journey.actions,
        entryCompletedAt
      );
      
      // Only add subsumed actions that aren't already in updatedActions
      for (const subsumedAction of subsumed) {
        if (!updatedActions.find(a => a.id === subsumedAction.id)) {
          updatedActions.push(subsumedAction);
        }
      }
    } else {
      // OCCURRENCE mode
      const updated = markActionComplete(actionInstance, event.occurredAt, entryCompletedAt);
      updatedActions.push(updated);
    }

    // Get the final updated action for reminder checking
    const finalAction = updatedActions.find(a => a.id === action.id) || actionInstance;
    
    // Check for reminders (only for overdue actions)
    const lastReminderTimesRecord: Record<string, Date> = Object.fromEntries(lastReminderTimes);
    const reminderNotifs = checkReminders(finalAction, currentTime, lastReminderTimesRecord);
    newNotifications.push(...reminderNotifs);
  }

  return { updatedActions, newNotifications };
}


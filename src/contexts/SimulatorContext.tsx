import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ActionInstance, Event, Notification, Product } from '@/lib/types';
import { useJourney } from './JourneyContext';
import { processEvent } from '@/lib/eventProcessor';
import { calculateDeadline, calculateActionStatus } from '@/lib/deadlineCalculator';
import { checkReminders } from '@/lib/reminderTrigger';

interface SimulatorContextValue {
  simulatedTime: Date;
  setSimulatedTime: (time: Date) => void;
  fastForwardDays: (days: number) => void;
  resetToNow: () => void;
  events: Event[];
  actionInstances: ActionInstance[];
  notifications: Notification[];
  triggerEvent: (eventType: string, product: Product) => Promise<void>;
  entryActionCompletedAt?: Date;
  setEntryActionCompletedAt: (date: Date | undefined) => void;
  markNotificationRead: (notificationId: string) => void;
  resetSimulation: () => void;
}

const SimulatorContext = createContext<SimulatorContextValue | undefined>(undefined);

export function SimulatorProvider({ children }: { children: React.ReactNode }) {
  const { currentJourney } = useJourney();
  const [simulatedTime, setSimulatedTimeState] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [actionInstances, setActionInstances] = useState<ActionInstance[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [entryActionCompletedAt, setEntryActionCompletedAtState] = useState<Date | undefined>(undefined);
  
  // Track last reminder trigger times (reminderId -> last trigger time)
  const lastReminderTimesRef = useRef<Map<string, Date>>(new Map());

  // Initialize action instances when journey changes
  useEffect(() => {
    if (!currentJourney) {
      setActionInstances([]);
      setEntryActionCompletedAtState(undefined);
      setEvents([]);
      setNotifications([]);
      lastReminderTimesRef.current.clear();
      return;
    }

    // Convert actions to action instances (only when journey changes)
    // Calculate deadlines using entryActionCompletedAt if available, otherwise use current simulated time
    // This ensures deadlines are always shown, even when journey hasn't started
    const deadlineBase = entryActionCompletedAt || simulatedTime;
    const instances: ActionInstance[] = currentJourney.actions.map((action) => {
      const deadline = action.timeRange.type !== 'NONE'
        ? calculateDeadline(
            action,
            deadlineBase,
            undefined // Previous action completion will be calculated when actions complete
          ) ?? undefined
        : undefined;

      return {
        ...action,
        status: 'NOT_DONE',
        currentCount: 0,
        deadline,
        entryActionCompletedAt,
      };
    });

    setActionInstances(instances);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentJourney?.id, entryActionCompletedAt]); // Reinitialize when journey or entry completion changes
  // Note: simulatedTime is used in calculation but not in deps to avoid excessive recalculations
  // The time update effect handles deadline updates when time changes

  // Update deadlines when entry action completion time changes
  useEffect(() => {
    if (!currentJourney || !entryActionCompletedAt) return;

    setActionInstances((prev) =>
      prev.map((instance) => {
        const deadline = calculateDeadline(
          instance,
          entryActionCompletedAt!,
          undefined // Previous action completion will be calculated when actions complete
        ) ?? undefined;
        return {
          ...instance,
          deadline,
          entryActionCompletedAt,
        };
      })
    );
  }, [entryActionCompletedAt, currentJourney?.id]);

  // Update action statuses and deadlines when time changes
  useEffect(() => {
    if (!currentJourney || actionInstances.length === 0) return;

    const updatedInstances = actionInstances.map((instance) => {
      // Recalculate deadline - use entryActionCompletedAt if available, otherwise use current time
      // This ensures deadlines are always shown, even when journey hasn't started
      const deadlineBase = entryActionCompletedAt || simulatedTime;
      const deadline = instance.timeRange.type !== 'NONE'
        ? calculateDeadline(
            instance,
            deadlineBase,
            undefined // TODO: Calculate previous action completion time
          ) ?? undefined
        : undefined;

      // Recalculate status
      const status = calculateActionStatus(
        { ...instance, deadline },
        simulatedTime
      );

      return {
        ...instance,
        deadline,
        status,
      };
    });

    setActionInstances(updatedInstances);

    // Check for new reminders when time changes
    const newNotifications: Notification[] = [];
    updatedInstances.forEach((instance) => {
      const lastReminderTimesRecord: Record<string, Date> = Object.fromEntries(lastReminderTimesRef.current);
      const reminderNotifs = checkReminders(
        instance,
        simulatedTime,
        lastReminderTimesRecord
      );
      newNotifications.push(...reminderNotifs);
    });

    if (newNotifications.length > 0) {
      setNotifications((prev) => [...newNotifications, ...prev]);
    }
  }, [simulatedTime, currentJourney, entryActionCompletedAt]);

  const setSimulatedTime = useCallback((time: Date) => {
    setSimulatedTimeState(time);
  }, []);

  const fastForwardDays = useCallback((days: number) => {
    setSimulatedTimeState((prev) => {
      const newTime = new Date(prev);
      newTime.setDate(newTime.getDate() + days);
      return newTime;
    });
  }, []);

  const resetToNow = useCallback(() => {
    setSimulatedTimeState(new Date());
  }, []);

  const triggerEvent = useCallback(async (eventType: string, product: Product) => {
    if (!currentJourney) return;

    const event: Event = {
      id: uuidv4(),
      eventType,
      product,
      occurredAt: simulatedTime,
    };

    // Process the event
    const { updatedActions, newNotifications } = processEvent(
      event,
      currentJourney,
      actionInstances,
      entryActionCompletedAt,
      simulatedTime,
      lastReminderTimesRef.current
    );

    // Update action instances
    setActionInstances((prev) => {
      const updated = [...prev];
      
      updatedActions.forEach((updatedAction) => {
        const index = updated.findIndex((a) => a.id === updatedAction.id);
        if (index >= 0) {
          updated[index] = updatedAction;
        } else {
          updated.push(updatedAction);
        }
      });

      return updated;
    });

    // Add new notifications
    if (newNotifications.length > 0) {
      setNotifications((prev) => [...newNotifications, ...prev]);
    }

    // Add event to events list
    setEvents((prev) => [event, ...prev]);

    // If this is the entry action and journey hasn't started, set entry completion time
    if (!entryActionCompletedAt && currentJourney.actions.length > 0) {
      const entryAction = currentJourney.actions[0];
      if (entryAction.eventType === eventType && entryAction.product === product) {
        setEntryActionCompletedAtState(simulatedTime);
      }
    }
  }, [currentJourney, actionInstances, entryActionCompletedAt, simulatedTime]);

  const setEntryActionCompletedAt = useCallback((date: Date | undefined) => {
    setEntryActionCompletedAtState(date);
  }, []);

  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  }, []);

  const resetSimulation = useCallback(() => {
    if (!currentJourney) return;

    const now = new Date();

    // Reset simulated time to now
    setSimulatedTimeState(now);

    // Clear all events
    setEvents([]);

    // Clear notifications
    setNotifications([]);

    // Clear entry action completion time
    setEntryActionCompletedAtState(undefined);

    // Clear reminder times
    lastReminderTimesRef.current.clear();

    // Reset action instances to initial state with deadlines recalculated
    // Use current time as base for deadline calculations (as if journey would start now)
    const instances: ActionInstance[] = currentJourney.actions.map((action) => {
      // Calculate deadline using current time as entry point (for display purposes)
      // This ensures deadlines are shown even when journey hasn't started
      const deadline = action.timeRange.type !== 'NONE'
        ? calculateDeadline(action, now, undefined) ?? undefined
        : undefined;

      return {
        ...action,
        status: 'NOT_DONE',
        currentCount: 0,
        deadline,
        completedAt: undefined,
        entryActionCompletedAt: undefined,
      };
    });

    setActionInstances(instances);
  }, [currentJourney]);

  return (
    <SimulatorContext.Provider
      value={{
        simulatedTime,
        setSimulatedTime,
        fastForwardDays,
        resetToNow,
        events,
        actionInstances,
        notifications,
        triggerEvent,
        entryActionCompletedAt,
        setEntryActionCompletedAt,
        markNotificationRead,
        resetSimulation,
      }}
    >
      {children}
    </SimulatorContext.Provider>
  );
}

export function useSimulator() {
  const context = useContext(SimulatorContext);
  if (context === undefined) {
    throw new Error('useSimulator must be used within a SimulatorProvider');
  }
  return context;
}


import type { Action, Reminder, TimeRange } from '@/lib/types';

// Mock action data for showcasing different card variations
export const mockEntryAction: Action = {
  id: 'mock-entry-1',
  actionTypeId: 'A01',
  eventType: 'EGYM_ACCOUNT_CREATED',
  completionMode: 'OCCURRENCE',
  requiredCount: 1,
  supportedProducts: ['BMA', 'FITHUB'],
  product: 'FITHUB',
  visibleInChecklist: true,
  supportsGuidance: true,
  guidanceEnabled: true,
  timeRange: {
    type: 'ABSOLUTE',
    durationDays: 7,
    durationUnit: 'DAYS',
  },
  reminders: [
    {
      id: 'reminder-1',
      channel: 'PUSH',
      frequencyType: 'EVERY_X_DAYS',
      frequencyDays: 3,
      order: 1,
    },
  ],
};

export const mockFullConfigAction: Action = {
  id: 'mock-full-1',
  actionTypeId: 'A12',
  eventType: 'FITNESS_GOALS_DEFINED',
  completionMode: 'COUNTER',
  requiredCount: 3,
  supportedProducts: ['BMA', 'FITHUB', 'TRAINER_APP'],
  product: 'BMA',
  visibleInChecklist: true,
  supportsGuidance: true,
  guidanceEnabled: false,
  timeRange: {
    type: 'WITH_PREVIOUS',
    offsetDays: 1,
    offsetUnit: 'DAYS',
  },
  reminders: [
    {
      id: 'reminder-2',
      channel: 'EMAIL',
      frequencyType: 'ONCE',
      order: 1,
    },
    {
      id: 'reminder-3',
      channel: 'PUSH',
      frequencyType: 'EVERY_X_DAYS',
      frequencyDays: 2,
      order: 2,
    },
  ],
};

export const mockMinimalAction: Action = {
  id: 'mock-minimal-1',
  actionTypeId: 'A13',
  eventType: 'WORKOUT_TRACKED',
  completionMode: 'OCCURRENCE',
  requiredCount: 1,
  supportedProducts: ['BMA'],
  product: 'BMA',
  visibleInChecklist: false,
  supportsGuidance: false,
  guidanceEnabled: false,
  timeRange: {
    type: 'NONE',
  },
  reminders: [],
};

export const mockNoDeadlineAction: Action = {
  id: 'mock-no-deadline-1',
  actionTypeId: 'A02',
  eventType: 'CHECK_IN_DONE',
  completionMode: 'COUNTER',
  requiredCount: 5,
  supportedProducts: ['BMA', 'FITHUB'],
  product: 'BMA',
  visibleInChecklist: true,
  supportsGuidance: true,
  guidanceEnabled: true,
  timeRange: {
    type: 'NONE',
  },
  reminders: [],
};


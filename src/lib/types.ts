// Domain Types for Journey Builder

export type Product = 'BMA' | 'FITHUB' | 'TRAINER_APP' | 'SMART_STRENGTH' | 'UNKNOWN';
export type CompletionMode = 'OCCURRENCE' | 'COUNTER';
export type TimeRangeType = 'NONE' | 'ABSOLUTE' | 'WITH_PREVIOUS';
export type TimeUnit = 'DAYS' | 'WEEKS' | 'MONTHS';
export type ReminderChannel = 'PUSH' | 'EMAIL' | 'TRAINER' | 'WEBHOOK';
export type ReminderFrequency = 'ONCE' | 'EVERY_X_DAYS';
export type NodeType = 'START' | 'ACTION' | 'DECISION' | 'MERGE' | 'END';
export type ActionStatus = 'NOT_DONE' | 'IN_PROGRESS' | 'DONE' | 'OVERDUE';

export interface TimeRange {
  type: TimeRangeType;
  durationDays?: number;  // for ABSOLUTE (stored in days, but can be displayed in different units)
  durationUnit?: TimeUnit; // for ABSOLUTE
  offsetDays?: number;    // for WITH_PREVIOUS (stored in days, but can be displayed in different units)
  offsetUnit?: TimeUnit;  // for WITH_PREVIOUS
}

export interface Reminder {
  id: string;
  channel: ReminderChannel;
  frequencyType: ReminderFrequency;
  frequencyDays?: number;
  order: number;
}

export interface Action {
  id: string;
  actionTypeId: string;
  eventType: string;
  completionMode: CompletionMode;
  requiredCount?: number;
  supportedProducts: Product[];
  product: Product;
  visibleInChecklist: boolean;
  supportsGuidance: boolean;
  guidanceEnabled: boolean;
  timeRange: TimeRange;
  reminders: Reminder[];
}

export interface JourneyNode {
  id: string;
  nodeType: NodeType;
  actionId?: string;
  position: number;
}

export interface Journey {
  id: string;
  name: string;
  isDefault: boolean;
  nodes: JourneyNode[];
  actions: Action[];
  createdAt: Date;
  updatedAt: Date;
}

// Extended action with runtime state (for simulator)
export interface ActionInstance extends Action {
  status: ActionStatus;
  currentCount: number;
  deadline?: Date;
  completedAt?: Date;
  entryActionCompletedAt?: Date; // journey anchor time
}

export interface Event {
  id: string;
  eventType: string;
  product: Product;
  occurredAt: Date;
  metadata?: Record<string, unknown>;
}

export interface Notification {
  id: string;
  type: 'PUSH' | 'EMAIL';
  actionId: string;
  actionTitle: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// Action Library Types
export interface ActionLibraryItem {
  id: string; // e.g., 'A01', 'A02'
  title: string;
  eventType: string;
  completionMode: CompletionMode;
  supportedProducts: Product[];
  supportsGuidance: boolean;
  defaultGuidanceEnabled: boolean;
}


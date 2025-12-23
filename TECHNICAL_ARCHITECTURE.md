# Technical Architecture Plan
## Customer Journey Builder MVP

---

## 1. Technology Stack

### Core Framework
- **React 18+** with **TypeScript**
- **Vite** (fast dev server, simple config, no monorepo overhead)
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components (copy-paste, TypeScript-first, accessible)

### State Management
- **React Context API** (simple, built-in, no external dependencies)
  - `JourneyContext` - manages current journey, actions, journey list
  - `SimulatorContext` - manages simulated time, events, notifications, action states

### Drag & Drop
- **@dnd-kit/core** + **@dnd-kit/sortable** (modern, TypeScript-friendly, lightweight)

### Backend & Persistence
- **Supabase** (PostgreSQL database, real-time subscriptions, free tier)
- **@supabase/supabase-js** client library

### Utilities
- **date-fns** for date manipulation
- **zod** for runtime validation (optional, for form validation)
- **uuid** for generating IDs

### Deployment
- **Vercel** (zero-config, automatic deployments, free tier, easy sharing)

---

## 2. Project Structure

```
journey_builder_EGYM_v0/
├── src/
│   ├── components/
│   │   ├── builder/
│   │   │   ├── JourneyBuilder.tsx
│   │   │   ├── JourneySelector.tsx
│   │   │   ├── ActionList.tsx
│   │   │   ├── ActionCard.tsx
│   │   │   ├── ActionForm.tsx
│   │   │   ├── ReminderList.tsx
│   │   │   ├── ReminderForm.tsx
│   │   │   └── TimeRangeSelector.tsx
│   │   ├── simulator/
│   │   │   ├── MemberAppSimulator.tsx
│   │   │   ├── PhoneShell.tsx
│   │   │   ├── Checklist.tsx
│   │   │   ├── ChecklistItem.tsx
│   │   │   ├── NotificationFeed.tsx
│   │   │   ├── NotificationItem.tsx
│   │   │   ├── EventSimulator.tsx
│   │   │   └── TimeControl.tsx
│   │   └── shared/
│   │       ├── Button.tsx (shadcn)
│   │       ├── Card.tsx (shadcn)
│   │       ├── Input.tsx (shadcn)
│   │       └── ... (other shadcn components)
│   ├── contexts/
│   │   ├── JourneyContext.tsx
│   │   └── SimulatorContext.tsx
│   ├── lib/
│   │   ├── types.ts              # TypeScript type definitions
│   │   ├── actionLibrary.ts      # Action definitions (A01-A14)
│   │   ├── supabase.ts           # Supabase client setup
│   │   ├── utils.ts              # Helper functions
│   │   ├── eventProcessor.ts     # Event processing logic
│   │   ├── deadlineCalculator.ts # Deadline calculation
│   │   └── reminderTrigger.ts   # Reminder triggering logic
│   ├── App.tsx                   # Root component, mode toggle
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Tailwind imports
├── public/
├── .env.local                    # Local env vars (gitignored)
├── .env.example                  # Example env vars
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── vercel.json                   # Vercel deployment config
└── README.md
```

---

## 3. Data Models & Supabase Schema

### TypeScript Types

```typescript
// src/lib/types.ts

export type Product = 'BMA' | 'FITHUB' | 'TRAINER_APP' | 'SMART_STRENGTH' | 'UNKNOWN';
export type CompletionMode = 'OCCURRENCE' | 'COUNTER';
export type TimeRangeType = 'NONE' | 'ABSOLUTE' | 'WITH_PREVIOUS';
export type ReminderChannel = 'PUSH' | 'EMAIL' | 'TRAINER' | 'WEBHOOK';
export type ReminderFrequency = 'ONCE' | 'EVERY_X_DAYS';
export type NodeType = 'START' | 'ACTION' | 'DECISION' | 'MERGE' | 'END';
export type ActionStatus = 'NOT_DONE' | 'IN_PROGRESS' | 'DONE' | 'OVERDUE';

export interface TimeRange {
  type: TimeRangeType;
  durationDays?: number;  // for ABSOLUTE
  offsetDays?: number;    // for WITH_PREVIOUS
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
```

### Supabase Database Schema

```sql
-- journeys table
CREATE TABLE journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- journey_nodes table (graph structure - MVP is linear)
CREATE TABLE journey_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id UUID REFERENCES journeys(id) ON DELETE CASCADE,
  node_type TEXT NOT NULL CHECK (node_type IN ('START', 'ACTION', 'DECISION', 'MERGE', 'END')),
  action_id UUID, -- nullable, only if node_type = ACTION
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- journey_edges table (for future branching - MVP not used but schema ready)
CREATE TABLE journey_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_node_id UUID REFERENCES journey_nodes(id) ON DELETE CASCADE,
  to_node_id UUID REFERENCES journey_nodes(id) ON DELETE CASCADE,
  label TEXT, -- nullable, e.g. 'true'/'false'
  condition_id UUID, -- nullable, for future conditions
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- actions table (action instances in journeys)
CREATE TABLE actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id UUID REFERENCES journeys(id) ON DELETE CASCADE,
  action_type_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  completion_mode TEXT NOT NULL CHECK (completion_mode IN ('OCCURRENCE', 'COUNTER')),
  required_count INTEGER, -- nullable, only if COUNTER
  product TEXT NOT NULL CHECK (product IN ('BMA', 'FITHUB', 'TRAINER_APP', 'SMART_STRENGTH', 'UNKNOWN')),
  visible_in_checklist BOOLEAN DEFAULT true,
  guidance_enabled BOOLEAN DEFAULT false,
  time_range_type TEXT NOT NULL CHECK (time_range_type IN ('NONE', 'ABSOLUTE', 'WITH_PREVIOUS')),
  time_range_duration_days INTEGER, -- nullable, for ABSOLUTE
  time_range_offset_days INTEGER, -- nullable, for WITH_PREVIOUS
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- reminders table
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id UUID REFERENCES actions(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('PUSH', 'EMAIL', 'TRAINER', 'WEBHOOK')),
  frequency_type TEXT NOT NULL CHECK (frequency_type IN ('ONCE', 'EVERY_X_DAYS')),
  frequency_days INTEGER, -- nullable, if EVERY_X_DAYS
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- events table (simulated events for demo)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  product TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL, -- simulated time
  metadata JSONB, -- nullable, for future extensibility
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- event_completions table (tracks which events completed which actions)
CREATE TABLE event_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  action_id UUID REFERENCES actions(id) ON DELETE CASCADE,
  count INTEGER NOT NULL, -- for COUNTER actions
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, action_id)
);

-- conditions table (future - MVP only has ALWAYS_TRUE concept)
CREATE TABLE conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  condition_type TEXT NOT NULL CHECK (condition_type IN ('ALWAYS_TRUE', 'EVENT_BASED', 'COUNT_BASED', 'ATTRIBUTE_BASED')),
  config JSONB, -- nullable, condition-specific config
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_journey_nodes_journey_id ON journey_nodes(journey_id);
CREATE INDEX idx_journey_nodes_position ON journey_nodes(journey_id, position);
CREATE INDEX idx_actions_journey_id ON actions(journey_id);
CREATE INDEX idx_reminders_action_id ON reminders(action_id);
CREATE INDEX idx_events_occurred_at ON events(occurred_at);
CREATE INDEX idx_event_completions_action_id ON event_completions(action_id);
```

---

## 4. Component Architecture

### Main App Structure

**`src/App.tsx`** - Root component with mode toggle
```typescript
// Mode: 'builder-only' | 'split'
// Toggle button to switch between modes
// Renders BuilderOnlyView or SplitView
```

**`src/components/builder/JourneyBuilder.tsx`** - Main builder container
- Journey selector dropdown
- Action list with drag & drop
- Add action button
- Save/load from Supabase

**`src/components/simulator/MemberAppSimulator.tsx`** - Main simulator container
- Phone shell wrapper
- Checklist component
- Notification feed
- Event simulator panel
- Time control panel

### Context Providers

**`src/contexts/JourneyContext.tsx`**
```typescript
interface JourneyContextValue {
  currentJourney: Journey | null;
  journeys: Journey[];
  setCurrentJourney: (journeyId: string) => void;
  addAction: (action: Omit<Action, 'id'>) => Promise<void>;
  updateAction: (actionId: string, updates: Partial<Action>) => Promise<void>;
  deleteAction: (actionId: string) => Promise<void>;
  reorderActions: (actionIds: string[]) => Promise<void>;
  loadJourneys: () => Promise<void>;
  saveJourney: () => Promise<void>;
}
```

**`src/contexts/SimulatorContext.tsx`**
```typescript
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
  setEntryActionCompletedAt: (date: Date) => void;
}
```

---

## 5. Key Implementation Logic

### Event Processing

**`src/lib/eventProcessor.ts`**
```typescript
export function processEvent(
  event: Event,
  journey: Journey,
  entryCompletedAt?: Date
): {
  updatedActions: ActionInstance[];
  newNotifications: Notification[];
} {
  if (!entryCompletedAt) {
    // Journey not started - only process entry action
    const entryAction = journey.actions[0];
    if (entryAction && 
        entryAction.eventType === event.eventType && 
        entryAction.product === event.product) {
      return {
        updatedActions: [markActionComplete(entryAction, event.occurredAt)],
        newNotifications: []
      };
    }
    return { updatedActions: [], newNotifications: [] };
  }

  // Journey started - process all matching actions
  const matchingActions = journey.actions.filter(
    a => a.eventType === event.eventType && a.product === event.product
  );

  const updatedActions: ActionInstance[] = [];
  const newNotifications: Notification[] = [];

  for (const action of matchingActions) {
    if (action.completionMode === 'COUNTER') {
      const updated = incrementCount(action, event.occurredAt);
      updatedActions.push(updated);
      
      // Check milestone subsumption - all actions with same eventType
      const subsumed = checkMilestoneSubsumption(
        action.eventType,
        updated.currentCount,
        journey.actions
      );
      updatedActions.push(...subsumed);
    } else {
      const updated = markActionComplete(action, event.occurredAt);
      updatedActions.push(updated);
    }

    // Check for reminders
    const reminderNotifs = checkReminders(updated, event.occurredAt);
    newNotifications.push(...reminderNotifs);
  }

  return { updatedActions, newNotifications };
}

function checkMilestoneSubsumption(
  eventType: string,
  currentCount: number,
  allActions: Action[]
): ActionInstance[] {
  const matchingActions = allActions.filter(
    a => a.eventType === eventType && a.completionMode === 'COUNTER'
  );

  return matchingActions
    .filter(a => a.requiredCount && currentCount >= a.requiredCount)
    .map(a => markActionComplete(a, new Date()));
}
```

### Deadline Calculation

**`src/lib/deadlineCalculator.ts`**
```typescript
export function calculateDeadline(
  action: Action,
  entryCompletedAt: Date,
  previousActionCompletedAt?: Date
): Date | null {
  if (action.timeRange.type === 'NONE') return null;
  
  if (action.timeRange.type === 'ABSOLUTE') {
    return addDays(entryCompletedAt, action.timeRange.durationDays!);
  }
  
  if (action.timeRange.type === 'WITH_PREVIOUS') {
    if (!previousActionCompletedAt) return null;
    return addDays(previousActionCompletedAt, action.timeRange.offsetDays!);
  }
  
  return null;
}

export function calculateActionStatus(
  action: ActionInstance,
  currentTime: Date
): ActionStatus {
  if (action.completedAt) return 'DONE';
  
  if (action.completionMode === 'COUNTER' && action.currentCount > 0) {
    if (action.requiredCount && action.currentCount < action.requiredCount) {
      return 'IN_PROGRESS';
    }
  }
  
  if (action.deadline && currentTime > action.deadline) {
    return 'OVERDUE';
  }
  
  return 'NOT_DONE';
}
```

### Reminder Triggering

**`src/lib/reminderTrigger.ts`**
```typescript
export function checkReminders(
  action: ActionInstance,
  currentTime: Date,
  lastReminderTimes: Map<string, Date> // reminderId -> last trigger time
): Notification[] {
  if (action.status !== 'OVERDUE') return [];
  
  const notifications: Notification[] = [];
  
  for (const reminder of action.reminders) {
    // Skip silent channels
    if (reminder.channel === 'TRAINER' || reminder.channel === 'WEBHOOK') {
      continue;
    }
    
    if (reminder.frequencyType === 'ONCE') {
      const lastTrigger = lastReminderTimes.get(reminder.id);
      if (!lastTrigger) {
        // Fire immediately when overdue
        notifications.push(createNotification(reminder, action));
        lastReminderTimes.set(reminder.id, currentTime);
      }
    } else {
      // EVERY_X_DAYS - fire immediately when overdue, then every X days
      const lastTrigger = lastReminderTimes.get(reminder.id);
      const daysSinceOverdue = differenceInDays(currentTime, action.deadline!);
      
      if (!lastTrigger) {
        // First trigger - fire immediately
        notifications.push(createNotification(reminder, action));
        lastReminderTimes.set(reminder.id, currentTime);
      } else {
        // Check if X days have passed since last trigger
        const daysSinceLastTrigger = differenceInDays(currentTime, lastTrigger);
        if (daysSinceLastTrigger >= reminder.frequencyDays!) {
          notifications.push(createNotification(reminder, action));
          lastReminderTimes.set(reminder.id, currentTime);
        }
      }
    }
  }
  
  return notifications;
}
```

---

## 6. Time Simulation (Simple Approach)

**`src/components/simulator/TimeControl.tsx`**
```typescript
// Simple controls:
// 1. "Set time to..." - Date picker
// 2. "Fast forward X days" - Input + button
// 3. "Reset to now" - Button
// 4. Display current simulated time

// Uses SimulatorContext.setSimulatedTime()
// No complex time stores - just useState<Date> in context
```

**Implementation:**
- `SimulatorContext` holds `simulatedTime: Date` state
- Time control component updates this state
- All deadline/reminder checks use `simulatedTime` instead of `new Date()`
- Simple and direct - perfect for prototype

---

## 7. Supabase Integration

**`src/lib/supabase.ts`**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**Environment Variables:**
```bash
# .env.local
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Real-time Subscriptions:**
```typescript
// In JourneyContext - subscribe to journey changes
useEffect(() => {
  const subscription = supabase
    .channel('journeys')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'journeys' },
      (payload) => {
        // Update local state
      }
    )
    .subscribe();
  
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

---

## 8. Default Journey Setup

**`src/lib/defaultJourney.ts`**
```typescript
export function createDefaultJourney(): Omit<Journey, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    name: "Gym A — Onboarding Journey (Default)",
    isDefault: true,
    nodes: [
      { id: 'start-1', nodeType: 'START', position: 0 },
      { id: 'action-1', nodeType: 'ACTION', actionId: 'action-1', position: 1 },
      { id: 'action-2', nodeType: 'ACTION', actionId: 'action-2', position: 2 },
    ],
    actions: [
      {
        id: 'action-1',
        actionTypeId: 'A01', // EGYM Account created (Entry)
        eventType: 'EGYM_ACCOUNT_CREATED',
        completionMode: 'OCCURRENCE',
        supportedProducts: ['BMA', 'FITHUB', 'TRAINER_APP', 'SMART_STRENGTH', 'UNKNOWN'],
        product: 'BMA',
        visibleInChecklist: true,
        supportsGuidance: true,
        guidanceEnabled: true,
        timeRange: { type: 'NONE' },
        reminders: []
      },
      {
        id: 'action-2',
        actionTypeId: 'A13', // Workout tracked (COUNTER example)
        eventType: 'WORKOUT_TRACKED',
        completionMode: 'COUNTER',
        requiredCount: 5,
        supportedProducts: ['SMART_STRENGTH', 'BMA', 'TRAINER_APP'],
        product: 'BMA',
        visibleInChecklist: true,
        supportsGuidance: false,
        guidanceEnabled: false,
        timeRange: { type: 'ABSOLUTE', durationDays: 30 },
        reminders: [
          {
            id: 'reminder-1',
            channel: 'PUSH',
            frequencyType: 'EVERY_X_DAYS',
            frequencyDays: 3,
            order: 0
          }
        ]
      }
    ]
  };
}
```

---

## 9. Vercel Deployment Configuration

**`vercel.json`**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "env": {
    "VITE_SUPABASE_URL": "@supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@supabase_anon_key"
  }
}
```

**Deployment Steps:**
1. Push code to GitHub
2. Connect repo to Vercel (vercel.com → New Project)
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy (automatic on push to main)
5. Share production URL: `your-app.vercel.app`

**Environment Variables Setup:**
- In Vercel dashboard: Settings → Environment Variables
- Add variables for Production, Preview, and Development
- Vercel will automatically inject them during build

---

## 10. Implementation Phases

### Phase 1: Foundation (Days 1-2) ✅ COMPLETE
- [x] Initialize Vite + React + TypeScript project
- [x] Setup Tailwind CSS + shadcn/ui
- [x] Create Supabase project and database schema
- [x] Define TypeScript types
- [x] Create action library (A01-A14)
- [x] Setup basic app structure with mode toggle
- [x] Design system extracted from Figma
- [x] Header and sidebar matching operator portal design

### Phase 2: Builder Panel (Days 3-5)
- [ ] JourneyContext implementation
- [ ] Journey selector component
- [ ] Action list with drag & drop (@dnd-kit)
- [ ] Action card component
- [ ] Action form (configuration)
- [ ] Reminder management
- [ ] Time range selector
- [ ] Supabase integration (save/load journeys)

### Phase 3: Simulator Panel (Days 6-8)
- [ ] SimulatorContext implementation
- [ ] Phone shell mockup
- [ ] Checklist component
- [ ] Checklist item with status indicators
- [ ] Notification feed (Push + Email)
- [ ] Event simulator (trigger events)
- [ ] Time control panel (simple date picker + fast forward)

### Phase 4: Core Logic (Days 9-10)
- [ ] Event processing logic
- [ ] Deadline calculation
- [ ] Action status calculation
- [ ] Reminder triggering
- [ ] Milestone subsumption
- [ ] Real-time sync between builder and simulator

### Phase 5: Polish & Testing (Days 11-12)
- [ ] Default journey setup
- [ ] Mode switching (builder-only ↔ split)
- [ ] UI/UX refinements
- [ ] Edge case handling
- [ ] Testing with stakeholders
- [ ] Vercel deployment

---

## 11. Key Design Decisions

### Why Vite instead of NX?
- **Faster setup** - no monorepo configuration overhead
- **Simpler mental model** - single app, easier to navigate
- **Faster dev server** - Vite is extremely fast
- **Easy to migrate later** - can move to NX if needed

### Why React Context instead of Zustand?
- **No external dependency** - built into React
- **Simple enough for MVP** - prototype doesn't need complex state
- **Easy to understand** - standard React pattern
- **Can upgrade later** - if state gets complex, migrate to Zustand

### Why Simple Time Simulation?
- **Prototype only** - never going to production
- **Direct control** - "set time to X" is clearer than complex time stores
- **Faster to build** - no time manipulation logic needed
- **Easier to debug** - simple Date state

### Why Vercel?
- **Zero config** - works out of the box with Vite
- **Free tier** - generous for prototypes
- **Easy sharing** - just share URL
- **Automatic deployments** - push to Git = deploy

---

## 12. Future Extensibility

The architecture supports future enhancements without major refactoring:

1. **Branching Journeys** - Graph data model already in place (nodes/edges tables)
2. **Complex Conditions** - Conditions table ready for event/count/attribute-based logic
3. **Multiple Journeys** - Journey selector and multi-journey support built in
4. **Guidance Content** - Guidance fields ready for text/images/QR codes
5. **Production Features** - Can add authentication, user management, etc.

---

## 13. Open Questions Resolved

✅ **Reminder timing**: Fire immediately when overdue, then every X days from that moment  
✅ **Milestone subsumption**: Check all actions with same eventType (not just previous)  
✅ **WITH_PREVIOUS**: Use immediately previous action in linear chain  
✅ **Default journey**: Pre-populated but allow custom (starts empty)  
✅ **Time simulation**: Simple control panel in MVP 1  
✅ **Guidance**: MVP 1 scope (placeholder UI for now, ready for text/pictures/QR codes)

---

## 14. Next Steps

1. **Review this architecture** - Confirm all decisions
2. **Setup Supabase project** - Create database and get credentials
3. **Initialize project** - Run `npm create vite@latest` and setup
4. **Start Phase 1** - Foundation setup
5. **Iterate** - Build, test, refine

---

**Ready to begin implementation!** 🚀


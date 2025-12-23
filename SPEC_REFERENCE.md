# Customer Journey Builder + Live Checklist Demo
## Final Spec Sheet (Cursor Reference)

---

## 1. Purpose

This prototype serves two goals:

1. **Vision alignment (internal)**  
   Make the Journey Layer tangible: how events → actions → reminders → member experience connect.

2. **Prototype testing (external)**  
   Enable feedback sessions with operators and stakeholders to validate:
   - journey composition
   - action parameters
   - reminder usefulness
   - checklist & notification clarity

The prototype is intentionally **demo-grade but semantically complete**.

---

## 2. Layout & Modes

### Modes
- **Builder-only mode**  
  Full-screen Journey Builder.
- **Split mode**  
  Journey Builder (left) + Member App Simulator (right).

Users can toggle between modes at runtime.

---

## 3. Core Concepts

### 3.1 Journey
- A Journey is an ordered list of Actions.
- Order defines **recommended sequence**, not hard dependencies.
- Demo shows a **Default Journey**, but UI implies future customization:
  - journey selector visible
  - journey named e.g. "Gym A — Onboarding Journey (Default)"

### 3.2 Entry Action (Anchor)
- The **first action** is the **Entry action**.
- The Journey starts when the Entry action completes.
- Entry action completion timestamp is the **anchor** for:
  - event counting
  - deadlines
  - reminders

Label explicitly in the builder: **"Entry action (journey start)"**.

---

## 4. Action Model

An Action represents a task or milestone fulfilled by observing events.

### 4.1 Action Instance Fields

- `id`
- `actionTypeId` (from Action Library)
- `eventType`
- `completionMode` (`OCCURRENCE` | `COUNTER`)
- `requiredCount` (only if COUNTER)
- `supportedProducts` (from library)
- `product` (selected; must be supported)
- `visibleInChecklist` (default true)
- `supportsGuidance` (from library)
- `guidanceEnabled` (default from library)
- `timeRange`
  - `NONE`
  - `ABSOLUTE(durationDays)`
- `WITH_PREVIOUS(offsetDays)`
- `reminders[]`

### 4.2 Titles
- Action titles are **defined by the Action Library**.
- Titles are **not freely editable** in MVP.
- (Optional aliasing may exist later, not MVP.)

---

## 5. Member-Facing Checklist Logic

### 5.1 Rendering
- Show **only actions with `visibleInChecklist = true`**.
- Always render in journey order.
- No locking or gating.
- Checklist header displays journey name.

### 5.2 Status Model
Each action can be in one state:

- **Not done**
- **In progress** (optional visual state; `0 < count < requiredCount`)
- **In progress** (optional visual state; `0 < count < requiredCount`)
- **Done**
- **Overdue** (not done AND deadline passed)

---

## 6. Events & Completion

### 6.1 Journey Start
- Journey starts only when Entry action completes.
- Events before journey start:
  - are ignored
  - do not count toward completion

### 6.2 Counting Rule
- For COUNTER actions:
  - count **all matching events since Entry action completion**
- OCCURRENCE actions are implicitly `requiredCount = 1`.

### 6.3 Milestone Subsumption
- Multiple actions using the same eventType with increasing requiredCount are monotonic:
  - achieving a higher count automatically completes lower milestones
  - e.g. 10 workouts → milestones 1, 5, and 10 are all done

---

## 7. Deadlines & Time Ranges

### 7.1 Deadline Calculation

For action *i*:

- `NONE`
  - no deadline

- `ABSOLUTE(durationDays)`
  - deadline = `entryActionCompletedAt + durationDays`

- `WITH_PREVIOUS(offsetDays)`
  - deadline = `previousActionCompletedAt + offsetDays`
  - if previous action not completed → no deadline yet

### 7.2 Overdue
- Action becomes **Overdue** when:
  - deadline exists
  - current time > deadline
  - action not done

---

## 8. Reminders

### 8.1 Triggering
- Reminders start **immediately when an action becomes overdue**.
- Continue until the action is completed.

### 8.2 Frequency
- `ONCE`: fires a single time
- `EVERY_X_DAYS`: fires immediately when overdue, then every X days

### 8.3 Channels (Demo Behavior)
- **Push** → visible OS-style push notification
- **Email** → visible notification styled like an email app push
- **Trainer** → no visible effect (silent)
- **Webhook** → no visible effect (silent)

### 8.4 Builder UX
- Reminders are **visually emphasized** within each action card.
- Reminders are optional but treated as first-class configuration.

---

## 9. Journey Builder (Left Panel)

### Capabilities
- Add / delete actions
- Drag & drop reorder actions
- Configure:
  - action type
  - requiredCount (if COUNTER)
  - product (restricted to supportedProducts)
  - visibility
  - guidance
  - time range
- Add / delete / reorder reminders
- Configure reminder channel and frequency

### Visual Rules
- Entry action clearly labeled
- Hidden actions visible in builder but excluded from checklist
- Journey selector visible (even if only default journey exists)

---

## 10. Member App Simulator (Right Panel)

### Components
- Phone shell
- Checklist
- Notification feed (Push + Email)
- Event simulator:
  - Entry event must be triggered first
  - Subsequent events update checklist, progress, counters, reminders

Trainer/Webhook reminders produce no visible output.

---

## 11. Branching-Ready Architecture (Not Implemented, Must Be Supported)

### 11.1 Journey as Graph
Journey is modeled as a **directed graph**, not just a list.

#### Node Types
- `START`
- `ACTION`
- `DECISION` (future)
- `MERGE` (future)
- `END` (optional)

#### Edges
- `fromNodeId`
- `toNodeId`
- optional `label` (e.g. true / false)

### 11.2 Conditions (Future)
- Conditions exist as data objects but only `ALWAYS_TRUE` is used in MVP.
- Schema must allow future conditions:
  - event-based
  - count-based
  - attribute-based

### MVP Constraint
- Graph is a single linear chain:
  `START → ACTION → ACTION → …`

UI renders it as a list, but data model supports splits and reconverges later.

---

## 12. Action Library (MVP)

### Products Enum
`BMA | FITHUB | TRAINER_APP | SMART_STRENGTH | UNKNOWN`

---

### A01 — EGYM Account created
- eventType: `EGYM_ACCOUNT_CREATED`
- completionMode: `OCCURRENCE`
- supportedProducts: `[BMA, FITHUB, TRAINER_APP, SMART_STRENGTH, UNKNOWN]`
- supportsGuidance: true
- defaultGuidanceEnabled: true

### A02 — Check-In done
- eventType: `CHECKIN_DONE`
- completionMode: `OCCURRENCE`
- supportedProducts: `[UNKNOWN]`
- supportsGuidance: false
- defaultGuidanceEnabled: false

### A03 — Strength test done
- eventType: `STRENGTH_TEST_DONE`
- completionMode: `COUNTER`
- supportedProducts: `[SMART_STRENGTH, TRAINER_APP, BMA]`
- supportsGuidance: true
- defaultGuidanceEnabled: false

### A04 — Flexibility test done
- eventType: `FLEXIBILITY_TEST_DONE`
- completionMode: `COUNTER`
- supportedProducts: `[FITHUB, TRAINER_APP, BMA]`
- supportsGuidance: true
- defaultGuidanceEnabled: false

### A05 — Training plan created
- eventType: `TRAINING_PLAN_CREATED`
- completionMode: `OCCURRENCE`
- supportedProducts: `[BMA, TRAINER_APP]`
- supportsGuidance: true
- defaultGuidanceEnabled: true

### A06 — Training plan expired
- eventType: `TRAINING_PLAN_EXPIRED`
- completionMode: `OCCURRENCE`
- supportedProducts: `[BMA, TRAINER_APP]`
- supportsGuidance: false
- defaultGuidanceEnabled: false

### A07 — BioAge calculated
- eventType: `BIOAGE_CALCULATED`
- completionMode: `OCCURRENCE`
- supportedProducts: `[FITHUB, BMA, TRAINER_APP]`
- supportsGuidance: true
- defaultGuidanceEnabled: false

### A08 — Trial started
- eventType: `TRIAL_STARTED`
- completionMode: `OCCURRENCE`
- supportedProducts: `[TRAINER_APP, SMART_STRENGTH, FITHUB, BMA]`
- supportsGuidance: false
- defaultGuidanceEnabled: false

### A09 — Trial ended
- eventType: `TRIAL_ENDED`
- completionMode: `OCCURRENCE`
- supportedProducts: `[BMA, TRAINER_APP]`
- supportsGuidance: false
- defaultGuidanceEnabled: false

### A10 — RFID linked
- eventType: `RFID_LINKED`
- completionMode: `OCCURRENCE`
- supportedProducts: `[FITHUB, TRAINER_APP, BMA, SMART_STRENGTH]`
- supportsGuidance: true
- defaultGuidanceEnabled: true

### A11 — NFC created
- eventType: `NFC_CREATED`
- completionMode: `OCCURRENCE`
- supportedProducts: `[BMA, TRAINER_APP]`
- supportsGuidance: true
- defaultGuidanceEnabled: false

### A12 — Fitness Goals defined
- eventType: `FITNESS_GOALS_DEFINED`
- completionMode: `OCCURRENCE`
- supportedProducts: `[BMA, FITHUB, TRAINER_APP]`
- supportsGuidance: true
- defaultGuidanceEnabled: true

### A13 — Workout tracked
- eventType: `WORKOUT_TRACKED`
- completionMode: `COUNTER`
- supportedProducts: `[SMART_STRENGTH, BMA, TRAINER_APP]`
- supportsGuidance: false
- defaultGuidanceEnabled: false

### A14 — Machine settings created
- eventType: `MACHINE_SETTINGS_CREATED`
- completionMode: `OCCURRENCE`
- supportedProducts: `[FITHUB, TRAINER_APP]`
- supportsGuidance: true
- defaultGuidanceEnabled: true

---

## 13. Definition of Done (Prototype)

The prototype is complete when:
- Builder edits immediately reflect in checklist
- Actions can be completed out of order
- Counters and milestone subsumption work
- Overdue actions trigger reminders correctly
- Builder-only and Split modes work
- Journey selector convincingly implies future customization
- Architecture clearly supports future branching without refactor

---


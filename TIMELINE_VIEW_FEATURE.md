# Timeline View Feature

## Overview

Add a horizontal timeline view to the journey builder canvas that visually represents the temporal relationships between actions. This helps users understand when actions occur relative to each other and the journey start.

## Goals

- Visualize time relationships between actions
- Show deadlines and time ranges in an intuitive timeline format
- Help users understand the overall journey timeline at a glance
- Support gym journey timelines (typically 3 months)

## Design Approach

### Timeline Type: Horizontal Timeline Bar

A horizontal timeline bar positioned above the action list, showing:
- Entry action at position 0 (journey start)
- Actions positioned by their calculated deadline
- Time markers showing relevant milestones
- Visual grouping for immediate sequences (actions that happen together)

### Smart Timeline Markers

The timeline uses adaptive markers that only show relevant time points:

**Standard Marker Set:**
- Day 0 (Start/Entry)
- 1 Day
- 1 Week (7 days)
- 2 Weeks (14 days)
- 4 Weeks (28 days)
- 2 Months (60 days)
- 3 Months (90 days)
- 6 Months (180 days)
- 1 Year (365 days)

**Adaptive Logic:**
- Only show markers that are within the journey range
- Show markers that have actions nearby (within ±3 days threshold)
- Always include key milestones (1 Day, 1 Week, 3 Months) if within range
- Skip empty ranges (e.g., if nothing happens between 2 Weeks and 4 Weeks, skip to next relevant marker)

### Visual Design

```
┌─────────────────────────────────────────────────────────┐
│ Timeline                                                 │
│ ─────────────────────────────────────────────────────── │
│ Start ──[1 Week]────[4 Weeks]────[3 Months]──────────── │
│   0        7           28           90                  │
│   │        │           │            │                  │
│   ▼        ▼           ▼            ▼                  │
│ ┌─────┐  ┌─────┐   ┌─────┐     ┌─────┐              │
│ │Entry│  │Act 1│   │Act 2│     │Act 3│              │
│ └─────┘  └─────┘   └─────┘     └─────┘              │
└─────────────────────────────────────────────────────────┘
```

**Color Coding:**
- Green: Entry action
- Blue: Absolute time (from start)
- Orange: Relative time (after previous)
- Grey: No deadline (shown at end or separate section)

## Technical Implementation

### Components

1. **TimelineView.tsx** - Main timeline component
   - Renders horizontal timeline bar
   - Calculates and displays time markers
   - Positions action markers

2. **TimelineMarker.tsx** - Individual marker component
   - Displays time label (e.g., "1 Week", "3 Months")
   - Shows day count
   - Visual indicator (line/bar)

3. **ActionTimelineMarker.tsx** - Action position indicator
   - Small dot/bar on timeline showing action position
   - Tooltip with action details
   - Connection line to action card (optional)

### Utility Functions

**calculateTimelinePositions(actions: Action[]): TimelinePosition[]**
- Calculates deadline for each action
- Determines position on timeline (0 = start)
- Handles different time range types:
  - `NONE`: Position at end or separate section
  - `ABSOLUTE`: Position = durationDays from 0
  - `WITH_PREVIOUS`: Position = previous position + offsetDays
  - `WITH_PREVIOUS` (offsetDays: 0): Same position as previous (grouped)

**calculateTimelineMarkers(actions: Action[], maxDays?: number): TimelineMarker[]**
- Determines which markers to show
- Filters standard markers based on:
  - Journey range (0 to max deadline)
  - Action proximity (within ±3 days)
  - Key milestones (always include if in range)
- Returns sorted array of relevant markers

**getMaxJourneyDays(actions: Action[]): number**
- Calculates maximum deadline across all actions
- Defaults to 90 days (3 months) if no deadlines
- Used to determine timeline scale

### Integration Points

1. **JourneyBuilder.tsx**
   - Add timeline toggle/view option
   - Render TimelineView above ActionList
   - Pass actions and entry action ID

2. **ActionList.tsx**
   - Optional: Add visual connection lines from timeline to cards
   - Maintain existing grouping logic
   - Support timeline positioning

### Data Flow

```
Actions (with timeRange)
  ↓
calculateTimelinePositions()
  ↓
Timeline Positions (day offsets)
  ↓
calculateTimelineMarkers()
  ↓
Relevant Markers
  ↓
TimelineView renders markers + action positions
```

## User Experience

### View Options

**Option 1: Always Visible**
- Timeline bar always shown above action list
- No toggle needed
- Provides constant context

**Option 2: Toggle View**
- Button to show/hide timeline
- Saves space when not needed
- User preference

**Option 3: Alternative View**
- Switch between list view and timeline view
- Full timeline replaces list
- More detailed timeline visualization

### Interaction

- Hover over timeline markers: Show tooltip with exact date
- Hover over action markers: Show action details
- Click action marker: Scroll to/focus action card
- Zoom: Timeline scales with canvas zoom

## Edge Cases

1. **No Deadlines**
   - Show actions at end of timeline
   - Or in separate "No deadline" section
   - Still show standard milestones

2. **Very Short Journey (< 1 week)**
   - Show Day 0, 1 Day, 1 Week
   - Compact timeline

3. **Very Long Journey (> 3 months)**
   - Continue with 6 Months, 1 Year markers
   - Auto-scale timeline width

4. **Immediate Sequences**
   - Group actions at same timeline position
   - Visual indicator (stacked markers or cluster)

5. **Mixed Time Units**
   - Convert all to days for calculation
   - Display in original unit (weeks/months) on markers

## Future Enhancements

- Interactive timeline: Drag actions to change deadlines
- Timeline zoom: Focus on specific time ranges
- Milestone markers: Custom milestones (e.g., "Trial End")
- Export timeline: Generate timeline visualization
- Timeline comparison: Compare multiple journeys

## Implementation Checklist

- [ ] Create TimelineView component
- [ ] Create TimelineMarker component
- [ ] Create ActionTimelineMarker component
- [ ] Implement calculateTimelinePositions utility
- [ ] Implement calculateTimelineMarkers utility
- [ ] Implement getMaxJourneyDays utility
- [ ] Integrate timeline into JourneyBuilder
- [ ] Add timeline styling (Tailwind CSS)
- [ ] Add hover tooltips
- [ ] Handle edge cases (no deadlines, short/long journeys)
- [ ] Test with various journey configurations
- [ ] Add accessibility features (ARIA labels, keyboard navigation)

## References

- Design inspiration: [Dribbble Timeline](https://cdn.dribbble.com/userupload/6548266/file/original-5f120ecd9ea518a94f9fdb4450ede45a.jpg)
- Standard gym journey timeline: 3 months (90 days)
- Time marker system: Adaptive based on action deadlines


# Checklist Design Issues - Prioritized Action List

**Date:** January 2025  
**Component:** Member-Facing Checklist  
**Review Type:** Senior Design Expert Assessment

---

## 🔴 High Priority Issues (Must Fix)

### H1: Missing Step Numbers for Step-by-Step Mental Model
**Severity:** Critical  
**Location:** `src/components/checklist/MemberChecklist.tsx`, `src/components/checklist/ChecklistItem.tsx`  
**Impact:** Users cannot see their position in the journey sequence

**Description:**
The checklist displays actions in order but lacks explicit step numbers (1, 2, 3...). This breaks the step-by-step mental model and makes it difficult for users to understand their progress through the journey.

**Recommendation:**
Add step number badges to each checklist item:
```tsx
// In ChecklistItem.tsx, add stepNumber prop
<div className="flex items-start gap-3">
  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-body-50-bold font-bold">
    {stepNumber}
  </div>
  {/* ... rest of content */}
</div>
```

**Design System Reference:** Use primary color for step badges, 8px border radius (rounded-full)

---

### H2: No Journey-Level Progress Overview
**Severity:** Critical  
**Location:** `src/components/checklist/MemberChecklist.tsx`  
**Impact:** Users cannot see overall journey completion, reducing motivation

**Description:**
There is no visual indication of overall journey progress (e.g., "3 of 5 steps completed"). Users must manually count cards to understand their progress.

**Recommendation:**
Add journey progress header with progress bar:
```tsx
// In MemberChecklist.tsx
const completedCount = visibleActions.filter(/* status === 'DONE' */).length;
const totalCount = visibleActions.length;

<div className="mb-12x p-6 bg-card rounded-lg border border-border card-shadow">
  <div className="flex items-center justify-between mb-4x">
    <h2 className="text-body-100-medium">Your Journey Progress</h2>
    <span className="text-body-50-bold">{completedCount} of {totalCount}</span>
  </div>
  <div className="w-full h-3 bg-muted rounded-full">
    <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
  </div>
</div>
```

**Design System Reference:** Use `p-12x` (24px), `mb-12x` (24px), `mb-4x` (8px), `h-3` (12px)

---

### H3: Spacing Not Compliant with Design System
**Severity:** High  
**Location:** `src/components/checklist/ChecklistItem.tsx` (line 102), `src/components/checklist/MemberChecklist.tsx` (line 63)  
**Impact:** Inconsistent spacing breaks design system compliance

**Description:**
- Card padding uses `p-4` (16px) instead of design system `p-12x` (24px)
- Card gap uses `space-y-4` (16px) instead of design system scale (`space-y-12x` = 24px)

**Recommendation:**
```tsx
// ChecklistItem.tsx line 102
<Card className={`p-12x border ...`}>  // Changed from p-4

// MemberChecklist.tsx line 63
<div className="space-y-12x">  // Changed from space-y-4
```

**Design System Reference:** `DESIGN_SYSTEM.md` - Spacing Scale: `12x` = 24px for cards

---

### H4: Hardcoded Colors Instead of Design System Tokens
**Severity:** High  
**Location:** `src/components/checklist/ChecklistItem.tsx` (lines 57-85)  
**Impact:** Colors don't match design system, harder to maintain

**Description:**
Status colors use hardcoded Tailwind classes (`text-green-600`, `bg-green-50`) instead of design system semantic colors (`text-success`, `bg-success/10`).

**Recommendation:**
```tsx
// Update getStatusConfig() function
case 'DONE':
  return {
    icon: CheckCircle2,
    color: 'text-success',  // Changed from text-green-600
    bgColor: 'bg-success/10',  // Changed from bg-green-50
    borderColor: 'border-success/20',  // Changed from border-green-200
    label: 'Done',
  };
// Similar changes for IN_PROGRESS (warning) and OVERDUE (destructive)
```

**Design System Reference:** `DESIGN_SYSTEM.md` - Semantic Colors: Success, Warning, Destructive

---

### H5: Missing ARIA Labels and Accessibility Support
**Severity:** High  
**Location:** `src/components/checklist/ChecklistItem.tsx` (multiple locations)  
**Impact:** Poor screen reader support, accessibility violations

**Description:**
- Status icons lack descriptive `aria-label`
- No list semantics (`role="list"`, `role="listitem"`)
- No live regions for status updates
- Missing `aria-describedby` for complex information

**Recommendation:**
```tsx
// Add ARIA labels
<div className="flex-shrink-0 mt-0.5" aria-label={`Status: ${statusConfig.label}`}>
  <StatusIcon className="h-5 w-5" aria-hidden="true" />
</div>

// Add list semantics in MemberChecklist.tsx
<div className="space-y-12x" role="list">
  {visibleActions.map((action, index) => (
    <div key={action.id} role="listitem">
      <ChecklistItem ... />
    </div>
  ))}
</div>

// Add live region for announcements
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {statusAnnouncement}
</div>
```

**Design System Reference:** WCAG 2.1 AA compliance required

---

## 🟡 Medium Priority Issues (Should Fix)

### M1: No Visual Progression Indicators Between Steps
**Severity:** Medium  
**Location:** `src/components/checklist/MemberChecklist.tsx`  
**Impact:** Steps feel disconnected, unclear flow

**Description:**
Actions appear as isolated cards with no visual connection. Users cannot see the flow between steps.

**Recommendation:**
Add connecting lines or visual flow indicators between steps (optional enhancement).

---

### M2: Status Indicator Not Prominent Enough
**Severity:** Medium  
**Location:** `src/components/checklist/ChecklistItem.tsx` (line 134)  
**Impact:** Status may be missed, especially on mobile

**Description:**
Status badge is small and may not be immediately noticeable. Background colors are very subtle.

**Recommendation:**
- Increase badge size slightly
- Add status icon to badge
- Increase background opacity for better visibility

---

### M3: Deadline Communication Lacks Urgency Indicators
**Severity:** Medium  
**Location:** `src/components/checklist/ChecklistItem.tsx` (lines 172-180)  
**Impact:** Users may miss approaching deadlines

**Description:**
Deadline text is small and doesn't use color coding to indicate urgency (e.g., red for overdue, amber for due soon).

**Recommendation:**
- Add color coding based on deadline proximity
- Increase text size or prominence
- Add visual countdown indicator

---

### M4: Mobile Touch Targets May Be Too Small
**Severity:** Medium  
**Location:** `src/components/checklist/ChecklistItem.tsx` (line 186)  
**Impact:** Poor mobile usability, accessibility issues

**Description:**
Guidance button and other interactive elements may not meet minimum 44x44px touch target size.

**Recommendation:**
```tsx
// Ensure minimum touch target
<button className="min-h-[44px] min-w-[44px] ...">
```

**Design System Reference:** WCAG 2.1 - Minimum touch target 44x44px

---

### M5: No Activation vs Retention Phase Indicators
**Severity:** Medium  
**Location:** `src/components/checklist/ChecklistItem.tsx`  
**Impact:** Users don't understand journey structure

**Description:**
All actions appear equal. No distinction between activation (early) and retention (later) phases.

**Recommendation:**
Add phase badges or grouping for first N actions (activation phase).

---

### M6: Product Icon Too Small
**Severity:** Medium  
**Location:** `src/components/checklist/ChecklistItem.tsx` (line 120)  
**Impact:** Hard to see product icon, poor visual hierarchy

**Description:**
Product icon uses `w-4 h-4` (16px) which is smaller than design system action icon size (20px).

**Recommendation:**
```tsx
// Increase icon size
<div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
  <img ... className="w-full h-full object-contain" />
</div>
```

**Design System Reference:** `DESIGN_SYSTEM.md` - Action Icon: 20px

---

### M7: Progress Bar Too Small on Mobile
**Severity:** Medium  
**Location:** `src/components/checklist/ChecklistItem.tsx` (line 152)  
**Impact:** Hard to see progress on small screens

**Description:**
Progress bar uses `h-2` (8px) which may be too small for mobile visibility.

**Recommendation:**
```tsx
// Increase height for better visibility
<div className="w-full h-3 bg-muted rounded-full overflow-hidden">
```

---

### M8: No Keyboard Navigation Documentation or Enhancements
**Severity:** Medium  
**Location:** All checklist components  
**Impact:** Poor keyboard accessibility

**Description:**
No documented keyboard shortcuts or enhanced keyboard navigation for checklist items.

**Recommendation:**
- Add keyboard shortcuts (arrow keys to navigate)
- Add skip links for long lists
- Document keyboard navigation

---

## 🟢 Low Priority Issues (Nice to Have)

### L1: No Journey Completion Celebration
**Severity:** Low  
**Location:** `src/components/checklist/MemberChecklist.tsx`  
**Impact:** Missed opportunity for engagement

**Description:**
No visual feedback or celebration when journey is completed.

**Recommendation:**
Add completion animation or success message when all actions are done.

---

### L2: Empty States Not Engaging
**Severity:** Low  
**Location:** `src/components/checklist/MemberChecklist.tsx` (lines 29-56)  
**Impact:** Poor first impression

**Description:**
Empty states are functional but generic. No illustrations or engaging messaging.

**Recommendation:**
Add illustrations, better copy, and clear CTAs to empty states.

---

### L3: No Milestone Messages for Progress
**Severity:** Low  
**Location:** `src/components/checklist/ChecklistItem.tsx`  
**Impact:** Missed motivation opportunity

**Description:**
Counter actions show progress but no encouragement messages at milestones (25%, 50%, 75%).

**Recommendation:**
Add milestone messages: "Halfway there!", "Almost done!", etc.

---

### L4: Guidance Section Not Discoverable Enough
**Severity:** Low  
**Location:** `src/components/checklist/ChecklistItem.tsx` (lines 184-209)  
**Impact:** Users may miss helpful guidance

**Description:**
Guidance button may not be obvious. No preview or indication of content.

**Recommendation:**
- Add icon to guidance button
- Show preview text or "Learn more" hint
- Improve placeholder content

---

### L5: Typography Inconsistencies
**Severity:** Low  
**Location:** `src/components/checklist/ChecklistItem.tsx` (multiple locations)  
**Impact:** Minor design system inconsistency

**Description:**
- Progress text uses `text-body-50` (could use `text-body-50-bold` for emphasis)
- Time frame uses `text-body-50` (could use `text-marginal-25-medium` for hierarchy)

**Recommendation:**
Review and standardize typography usage per design system.

---

### L6: No Card Shadow or Elevation
**Severity:** Low  
**Location:** `src/components/checklist/ChecklistItem.tsx` (line 102)  
**Impact:** Cards blend into background

**Description:**
Cards don't use shadow utility class, making them less distinct from background.

**Recommendation:**
```tsx
<Card className={`p-12x border card-shadow ...`}>
```

**Design System Reference:** `DESIGN_SYSTEM.md` - `.card-shadow` utility class

---

### L7: No Hover States for Cards
**Severity:** Low  
**Location:** `src/components/checklist/ChecklistItem.tsx`  
**Impact:** Reduced interactivity feedback

**Description:**
Cards don't have hover states, making them feel static.

**Recommendation:**
Add subtle hover effect (e.g., `hover:card-shadow-hover` or `hover:bg-muted/50`).

---

### L8: No First-Time User Onboarding
**Severity:** Low  
**Location:** `src/pages/ChecklistPage.tsx`  
**Impact:** Users may not understand checklist purpose

**Description:**
No welcome message or onboarding for first-time users.

**Recommendation:**
Add welcome message explaining checklist purpose and how to use it.

---

## Summary Statistics

- **Total Issues:** 21
- **High Priority:** 5 (Critical fixes needed)
- **Medium Priority:** 8 (Should fix soon)
- **Low Priority:** 8 (Nice to have)

**Estimated Effort:**
- High Priority: 2-3 days
- Medium Priority: 3-4 days
- Low Priority: 2-3 days
- **Total:** 7-10 days for complete implementation

---

## Implementation Order

1. **Phase 1 (Critical):** Fix H1-H5 (step numbers, progress overview, spacing, colors, accessibility)
2. **Phase 2 (Important):** Fix M1-M8 (visual flow, status prominence, mobile optimization)
3. **Phase 3 (Enhancement):** Fix L1-L8 (engagement features, polish)

---

*Issue list created: January 2025*







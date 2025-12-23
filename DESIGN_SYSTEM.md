# Design System
## Journey Builder MVP - EGYM Brand (Figma Design Tokens)

**Extracted from Figma: OX-UI-Kit2025**

---

## Color Palette

### Primary Colors (EGYM Brand)
- **Primary**: `#C75300` (Orange) - `hsl(20, 100%, 39%)`
  - **Figma Variable**: `Product/Light/Main Focus`
  - Used for: Primary buttons, active icons, CTAs, focus states
  - Foreground: White text on orange

- **Primary Elements**: `#000000` (Black)
  - **Figma Variable**: `Product/Light/Primary (Elements)`
  - Used for: Text, icons, primary content

### Neutral Colors
- **Background**: `#ffffff` (White)
  - **Figma Variable**: `color/surface/default`
  - Main app background

- **Foreground**: `#000000` (Black)
  - **Figma Variable**: `color/content/emphasized`
  - Primary text color

- **Secondary**: `#ededed` (Light Gray)
  - **Figma Variable**: `color/surface/default-pressed`
  - Sidebar backgrounds, inactive states, hover states

- **Muted**: `#8d8d8d` (Medium Gray)
  - **Figma Variable**: `color/content/hinted`
  - Secondary text, hints, labels

- **Border**: `#f2f2f2` (Very Light Gray)
  - **Figma Variable**: `color/border/hinted`
  - Subtle borders, dividers

### Semantic Colors
- **Success**: Green (`hsl(142, 71%, 45%)`) - Completed actions
- **Warning**: Amber (`hsl(38, 92%, 50%)`) - In-progress states
- **Info**: Blue (`hsl(217, 91%, 60%)`) - Informational messages
- **Destructive**: Red (`hsl(0, 84%, 60%)`) - Delete actions, errors, overdue

### Status Colors (for Actions)
- **Not Done**: Muted gray (`text-muted-foreground`)
- **In Progress**: Warning amber (`text-warning`)
- **Done**: Success green (`text-success`)
- **Overdue**: Destructive red (`text-destructive`)

---

## Typography

### Font Family
- **Primary**: `"Helvetica Now Display"`
  - **Figma Variable**: `typography/body-100/font-family`
  - Fallback: System font stack
  - Clean, modern, professional

### Typography Scale (From Figma)

#### Body 100 (Regular)
- **Font Size**: 16px
- **Line Height**: 24px
- **Letter Spacing**: 0.3px
- **Weight**: 400 (Regular)
- **Figma Variable**: `body/100/regular`
- **Usage**: Default body text, main content

#### Body 100 (Medium)
- **Font Size**: 16px
- **Line Height**: 24px
- **Letter Spacing**: 0.3px
- **Weight**: 500 (Medium)
- **Figma Variable**: `body/100/medium`
- **Usage**: Emphasized body text, navigation items

#### Body 50 (Bold)
- **Font Size**: 14px
- **Line Height**: 20px
- **Letter Spacing**: 0.3px
- **Weight**: 700 (Bold)
- **Figma Variable**: `body/50/bold`
- **Usage**: Small emphasized text, labels

#### Marginal 25 (Medium)
- **Font Size**: 12px
- **Line Height**: 16px
- **Letter Spacing**: 0.5px
- **Weight**: 500 (Medium)
- **Figma Variable**: `marginal/25/medium`
- **Usage**: Small labels, captions, sidebar navigation

#### Marginal 25 (Regular)
- **Font Size**: 12px
- **Line Height**: 16px
- **Letter Spacing**: 0.5px
- **Weight**: 400 (Regular)
- **Figma Variable**: `marginal/25/regular`
- **Usage**: Small secondary text

---

## Spacing Scale

Based on 4px base unit (from Figma):
- **4x**: 8px - `Spacing/4x`
- **10x**: 20px - `Spacing/10x`
- **12x**: 24px - `Spacing/12x`
- **14x**: 28px - `Spacing/14x`
- **16x**: 32px - `Spacing/16x`

Standard Tailwind spacing also available:
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)

---

## Border Radius

From Figma variables:
- **Card**: 8px - `Radius/card`
- **Text Area**: 4px - `Radius/text_area`
- **Round**: 9999px - `dimension/border/radius/round` (pills, circular)

Tailwind classes:
- **sm**: 4px (text areas)
- **md**: 6px (default)
- **lg**: 8px (cards, panels)
- **full**: 9999px (pills, avatars)

---

## Dimensions

### Icons
- **Action Icon**: 20px - `dimension/size/icon-action`
- **Default Icon**: 24px - `dimension/size/icon-default`

### Padding
- **Action Icon**: 12px - `dimension/padding/action-icon`
- **Action Block**: 8px - `dimension/padding/action-block`

### Gaps
- **300 Default**: 8px - `dimension/gap/300-default`

---

## Shadows

Minimal shadows for subtle depth:
- **card**: `0 1px 3px 0 rgb(0 0 0 / 0.05)` - Default card shadow
- **card-hover**: `0 4px 6px -1px rgb(0 0 0 / 0.1)` - Hover state

---

## Component Patterns

### Buttons
- **Primary**: Orange background (`bg-primary`), white text, rounded-md (8px)
  - Hover: Slightly darker orange
  - Focus: Orange ring
- **Secondary**: Light gray background (`bg-secondary`), black text
- **Ghost**: Transparent, hover shows light gray background
- **Destructive**: Red background for delete actions

### Cards/Panels
- White background
- Minimal shadow (`card-shadow` utility)
- Rounded corners (8px - lg)
- Padding: 24px (12x spacing)

### Tables
- Clean, minimal styling
- Subtle row hover (`table-row-hover` utility)
- Light borders between rows (#f2f2f2)
- Compact padding

### Inputs
- Border: 1px solid #f2f2f2
- Border radius: 4px (sm)
- Focus: Orange ring (`ring-primary`)
- Padding: 8px (4x spacing)

### Tabs
- Underlined active state
- Active: Black text, light gray background (#ededed)
- Inactive: Black text, white background
- Hover: Subtle background change

### Sidebar Navigation
- Light gray background (#ededed) for inactive items
- Active item: Light gray highlight (`sidebar-active` utility)
- Clean icons, consistent spacing
- Hover: Subtle background change

---

## Layout

### Grid System
- 12-column grid (when needed)
- Gutter: 24px (12x spacing)

### Container
- Max width: 1400px (2xl breakpoint)
- Padding: 28px (14x spacing)
- Center aligned

### Breakpoints
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1400px

---

## Animation

### Transitions
- **Fast**: 150ms - Hover states, quick interactions
- **Default**: 200ms - Standard transitions
- **Slow**: 300ms - Complex animations

### Easing
- **Default**: ease-in-out
- **Smooth**: cubic-bezier(0.4, 0, 0.2, 1)

---

## Accessibility

### Contrast Ratios
- All text meets WCAG AA (4.5:1 for normal text, 3:1 for large text)
- Orange on white: High contrast
- Interactive elements have clear focus states

### Focus States
- Visible ring: 2px solid orange (`ring-primary`)
- Offset: 2px from element

---

## Usage Examples

### Primary Button (EGYM Style)
```tsx
<button className="bg-primary text-primary-foreground rounded-md px-4 py-2 font-medium hover:opacity-90 transition-colors">
  Add Action
</button>
```

### Typography
```tsx
// Body 100 Regular
<p className="text-body-100">Default body text</p>

// Body 100 Medium
<p className="text-body-100-medium">Emphasized text</p>

// Marginal 25 Medium
<p className="text-marginal-25-medium">Small label</p>
```

### Card Component
```tsx
<div className="bg-card text-card-foreground rounded-lg card-shadow p-12x">
  {/* Content */}
</div>
```

### Sidebar Active Item
```tsx
<div className="sidebar-active rounded-lg p-4x">
  Active Item
</div>
```

---

## Design Tokens Reference

All design tokens are defined in:
- `src/index.css` - CSS custom properties (exact Figma values)
- `tailwind.config.js` - Tailwind theme extensions

### Figma Variables Mapped
- `Product/Light/Main Focus` → `--primary` (#C75300)
- `Product/Light/Primary (Elements)` → `--foreground` (#000000)
- `color/surface/default` → `--background` (#ffffff)
- `color/surface/default-pressed` → `--secondary` (#ededed)
- `color/border/hinted` → `--border` (#f2f2f2)
- `color/content/hinted` → `--muted-foreground` (#8d8d8d)
- `Radius/card` → `--radius` (8px)
- `Radius/text_area` → `--radius-sm` (4px)

---

**Design system extracted from Figma and fully aligned with EGYM brand guidelines** ✅

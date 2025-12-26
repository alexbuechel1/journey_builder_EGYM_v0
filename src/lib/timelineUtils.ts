import type { Action } from './types';

export interface TimelinePosition {
  actionId: string;
  days: number;
  action: Action;
}

export interface TimelineMarker {
  days: number;
  label: string;
  unit: 'DAYS' | 'WEEKS' | 'MONTHS' | 'YEARS';
}

const STANDARD_TIMELINE_MARKERS: TimelineMarker[] = [
  { days: 1, label: '1 Day', unit: 'DAYS' },
  { days: 7, label: '1 Week', unit: 'WEEKS' },
  { days: 14, label: '2 Weeks', unit: 'WEEKS' },
  { days: 28, label: '4 Weeks', unit: 'WEEKS' },
  { days: 60, label: '2 Months', unit: 'MONTHS' },
  { days: 90, label: '3 Months', unit: 'MONTHS' },
  { days: 180, label: '6 Months', unit: 'MONTHS' },
  { days: 365, label: '1 Year', unit: 'YEARS' },
];

const KEY_MILESTONES = [1, 7, 90]; // 1 Day, 1 Week, 3 Months

/**
 * Calculate the deadline in days for an action
 */
function calculateActionDeadline(
  action: Action,
  previousDeadline: number | null
): number | null {
  if (action.timeRange.type === 'NONE') {
    return null;
  }

  if (action.timeRange.type === 'ABSOLUTE') {
    return action.timeRange.durationDays || null;
  }

  // WITH_PREVIOUS
  if (previousDeadline === null) {
    return null;
  }

  const offsetDays = action.timeRange.offsetDays || 0;
  return previousDeadline + offsetDays;
}

/**
 * Calculate timeline positions for all actions
 */
export function calculateTimelinePositions(actions: Action[]): TimelinePosition[] {
  const positions: TimelinePosition[] = [];
  let previousDeadline: number | null = 0; // Entry action starts at 0

  actions.forEach((action, index) => {
    // Entry action is always at day 0
    if (index === 0) {
      positions.push({
        actionId: action.id,
        days: 0,
        action,
      });
      previousDeadline = 0;
      return;
    }

    const deadline = calculateActionDeadline(action, previousDeadline);
    
    if (deadline !== null) {
      positions.push({
        actionId: action.id,
        days: deadline,
        action,
      });
      previousDeadline = deadline;
    } else {
      // No deadline - position at end (we'll handle this separately)
      positions.push({
        actionId: action.id,
        days: -1, // Special marker for "no deadline"
        action,
      });
    }
  });

  return positions;
}

/**
 * Get the maximum number of days in the journey
 */
export function getMaxJourneyDays(actions: Action[]): number {
  const positions = calculateTimelinePositions(actions);
  const deadlines = positions
    .map(p => p.days)
    .filter(days => days >= 0); // Exclude "no deadline" markers

  if (deadlines.length === 0) {
    return 90; // Default to 3 months
  }

  const maxDays = Math.max(...deadlines);
  // Round up to nearest standard marker or default to 90 days
  return Math.max(maxDays, 90);
}

/**
 * Check if there's an action near a marker (within threshold)
 */
function hasActionNearby(
  markerDays: number,
  positions: TimelinePosition[],
  threshold: number = 3
): boolean {
  return positions.some(pos => {
    if (pos.days < 0) return false; // Skip "no deadline" actions
    return Math.abs(pos.days - markerDays) <= threshold;
  });
}

/**
 * Check if a marker is a key milestone
 */
function isKeyMilestone(days: number): boolean {
  return KEY_MILESTONES.includes(days);
}

/**
 * Calculate which timeline markers to display
 */
export function calculateTimelineMarkers(
  actions: Action[],
  maxDays?: number
): TimelineMarker[] {
  const calculatedMaxDays = maxDays || getMaxJourneyDays(actions);
  const positions = calculateTimelinePositions(actions);

  // Always include start marker
  const markers: TimelineMarker[] = [
    { days: 0, label: 'Start', unit: 'DAYS' },
  ];

  // Filter standard markers
  const relevantMarkers = STANDARD_TIMELINE_MARKERS.filter(marker => {
    // Must be within journey range
    if (marker.days > calculatedMaxDays) {
      return false;
    }

    // Include if:
    // 1. Has action nearby (within 3 days), OR
    // 2. Is a key milestone (1 Day, 1 Week, 3 Months)
    return (
      hasActionNearby(marker.days, positions, 3) ||
      isKeyMilestone(marker.days)
    );
  });

  markers.push(...relevantMarkers);

  // Sort by days
  return markers.sort((a, b) => a.days - b.days);
}

/**
 * Get the percentage position on timeline (0-100)
 */
export function getTimelinePosition(days: number, maxDays: number): number {
  if (days < 0) return 100; // "No deadline" actions at the end
  return Math.min((days / maxDays) * 100, 100);
}


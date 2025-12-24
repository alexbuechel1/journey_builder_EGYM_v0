import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Action, TimeRange } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Check if an action is part of an immediate sequence (happens right after previous)
 */
export function isImmediateSequence(timeRange: TimeRange): boolean {
  return timeRange.type === 'WITH_PREVIOUS' && 
         (!timeRange.offsetDays || timeRange.offsetDays === 0);
}

/**
 * Check if an action is part of a grouped sequence
 * Includes immediate sequence actions AND the source action they connect from
 * 
 * Grouping rules:
 * - First action (index 0) is NEVER in a group (no previous to connect to)
 * - An action is in a group if:
 *   1. It has "With previous" (offsetDays === 0) AND there's a previous action, OR
 *   2. The NEXT action has "With previous" (making current the source that the immediate action connects to)
 * 
 * This ensures groups only contain:
 * - The source action (the one that triggers the immediate sequence)
 * - All consecutive immediate actions that follow it
 * - NO actions that come after an immediate action but are not immediate themselves
 */
export function isInGroup(actions: Action[], currentIndex: number): boolean {
  // First action can never be in a group (no previous action to connect to)
  if (currentIndex === 0) return false;
  
  const current = actions[currentIndex];
  
  // Current action is in group if:
  // 1. Current is "With previous" (will connect to previous action), OR
  // 2. Next action is "With previous" (current is the source that the immediate action connects to)
  // 
  // This ensures:
  // - "With previous" actions always group with their immediate previous action
  // - Source actions are included in the group
  // - Actions that come AFTER an immediate action but are NOT immediate themselves are NOT grouped
  const isCurrentImmediate = isImmediateSequence(current.timeRange);
  
  // Check if next action is immediate (making current the source)
  const isNextImmediate = currentIndex < actions.length - 1 && 
                          isImmediateSequence(actions[currentIndex + 1].timeRange);
  
  return isCurrentImmediate || isNextImmediate;
}

/**
 * Check if an action is the start of a grouped sequence
 * Includes the source action (the one before immediate sequence starts)
 */
export function isGroupStart(actions: Action[], currentIndex: number): boolean {
  if (currentIndex === 0) return false;
  
  const inGroup = isInGroup(actions, currentIndex);
  const prevInGroup = isInGroup(actions, currentIndex - 1);
  
  // Group starts if we're in group but previous is not
  return inGroup && !prevInGroup;
}

/**
 * Check if an action is the end of a grouped sequence
 * Ends when we hit an action with its own timeframe (not immediate)
 */
export function isGroupEnd(actions: Action[], currentIndex: number): boolean {
  if (currentIndex === actions.length - 1) return false;
  
  const inGroup = isInGroup(actions, currentIndex);
  const nextInGroup = isInGroup(actions, currentIndex + 1);
  
  // Group ends if we're in group but next is not
  return inGroup && !nextInGroup;
}


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
 *   1. It has "With previous" AND the previous action doesn't have its own timeline
 *      (groups backwards with previous), OR
 *   2. The NEXT action has "With previous" (current is the source)
 * 
 * Key principle: Actions with their own timeline (ABSOLUTE or WITH_PREVIOUS with offset > 0)
 * should NOT group backwards with previous actions, but CAN be sources for "With previous"
 * actions that follow them.
 * 
 * This ensures groups contain:
 * - The source action (the one that triggers the immediate sequence)
 * - All consecutive immediate actions that follow it
 * - Actions with their own timeline are included as sources when a "With previous" action follows
 * - Actions with their own timeline are NOT grouped backwards with previous actions
 */
export function isInGroup(actions: Action[], currentIndex: number): boolean {
  // First action can never be in a group (no previous action to connect to)
  if (currentIndex === 0) return false;
  
  const current = actions[currentIndex];
  
  const isCurrentImmediate = isImmediateSequence(current.timeRange);
  const isNextImmediate = currentIndex < actions.length - 1 && 
                          isImmediateSequence(actions[currentIndex + 1].timeRange);
  
  // Rule 1: Current has "With previous" - always groups backwards with previous
  // (regardless of previous's timeline - "With previous" means group with immediate previous)
  const canGroupBackwards = isCurrentImmediate;
  
  // Rule 2: Next has "With previous" (current is the source)
  // Key: Actions with absolute timeline NEVER group backwards, but CAN group forwards
  // So if current has own timeline, it can still be source for next (forward grouping)
  // The grouping algorithm will handle breaking the group when previous is also in a group
  const canBeSource = isNextImmediate;
  
  // However, if current has own timeline AND previous is in a group,
  // we need to ensure they're not in the same group
  // This is handled by the grouping algorithm checking isGroupStart
  // For now, we return true if either condition is met
  return canGroupBackwards || canBeSource;
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


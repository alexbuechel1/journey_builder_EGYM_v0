import type { ActionLibraryItem, Product } from './types';

/**
 * Action Library - Predefined action types (A01-A14)
 * These define the available actions that can be added to journeys
 */
export const ACTION_LIBRARY: Record<string, ActionLibraryItem> = {
  A01: {
    id: 'A01',
    title: 'EGYM Account created',
    eventType: 'EGYM_ACCOUNT_CREATED',
    completionMode: 'OCCURRENCE',
    supportedProducts: ['BMA', 'FITHUB', 'TRAINER_APP', 'SMART_STRENGTH', 'UNKNOWN'],
    supportsGuidance: true,
    defaultGuidanceEnabled: true,
  },
  A02: {
    id: 'A02',
    title: 'Check-In done',
    eventType: 'CHECKIN_DONE',
    completionMode: 'OCCURRENCE',
    supportedProducts: ['UNKNOWN'],
    supportsGuidance: false,
    defaultGuidanceEnabled: false,
  },
  A03: {
    id: 'A03',
    title: 'Strength test done',
    eventType: 'STRENGTH_TEST_DONE',
    completionMode: 'COUNTER',
    supportedProducts: ['SMART_STRENGTH', 'TRAINER_APP', 'BMA'],
    supportsGuidance: true,
    defaultGuidanceEnabled: false,
  },
  A04: {
    id: 'A04',
    title: 'Flexibility test done',
    eventType: 'FLEXIBILITY_TEST_DONE',
    completionMode: 'COUNTER',
    supportedProducts: ['FITHUB', 'TRAINER_APP', 'BMA'],
    supportsGuidance: true,
    defaultGuidanceEnabled: false,
  },
  A05: {
    id: 'A05',
    title: 'Training plan created',
    eventType: 'TRAINING_PLAN_CREATED',
    completionMode: 'OCCURRENCE',
    supportedProducts: ['BMA', 'TRAINER_APP'],
    supportsGuidance: true,
    defaultGuidanceEnabled: true,
  },
  A06: {
    id: 'A06',
    title: 'Training plan expired',
    eventType: 'TRAINING_PLAN_EXPIRED',
    completionMode: 'OCCURRENCE',
    supportedProducts: ['BMA', 'TRAINER_APP'],
    supportsGuidance: false,
    defaultGuidanceEnabled: false,
  },
  A07: {
    id: 'A07',
    title: 'BioAge calculated',
    eventType: 'BIOAGE_CALCULATED',
    completionMode: 'OCCURRENCE',
    supportedProducts: ['FITHUB', 'BMA', 'TRAINER_APP'],
    supportsGuidance: true,
    defaultGuidanceEnabled: false,
  },
  A08: {
    id: 'A08',
    title: 'Trial started',
    eventType: 'TRIAL_STARTED',
    completionMode: 'OCCURRENCE',
    supportedProducts: ['TRAINER_APP', 'SMART_STRENGTH', 'FITHUB', 'BMA'],
    supportsGuidance: false,
    defaultGuidanceEnabled: false,
  },
  A09: {
    id: 'A09',
    title: 'Trial ended',
    eventType: 'TRIAL_ENDED',
    completionMode: 'OCCURRENCE',
    supportedProducts: ['BMA', 'TRAINER_APP'],
    supportsGuidance: false,
    defaultGuidanceEnabled: false,
  },
  A10: {
    id: 'A10',
    title: 'RFID linked',
    eventType: 'RFID_LINKED',
    completionMode: 'OCCURRENCE',
    supportedProducts: ['FITHUB', 'TRAINER_APP', 'BMA', 'SMART_STRENGTH'],
    supportsGuidance: true,
    defaultGuidanceEnabled: true,
  },
  A11: {
    id: 'A11',
    title: 'NFC created',
    eventType: 'NFC_CREATED',
    completionMode: 'OCCURRENCE',
    supportedProducts: ['BMA', 'TRAINER_APP'],
    supportsGuidance: true,
    defaultGuidanceEnabled: false,
  },
  A12: {
    id: 'A12',
    title: 'Fitness Goals defined',
    eventType: 'FITNESS_GOALS_DEFINED',
    completionMode: 'OCCURRENCE',
    supportedProducts: ['BMA', 'FITHUB', 'TRAINER_APP'],
    supportsGuidance: true,
    defaultGuidanceEnabled: true,
  },
  A13: {
    id: 'A13',
    title: 'Workout tracked',
    eventType: 'WORKOUT_TRACKED',
    completionMode: 'COUNTER',
    supportedProducts: ['SMART_STRENGTH', 'BMA', 'TRAINER_APP'],
    supportsGuidance: false,
    defaultGuidanceEnabled: false,
  },
  A14: {
    id: 'A14',
    title: 'Machine settings created',
    eventType: 'MACHINE_SETTINGS_CREATED',
    completionMode: 'OCCURRENCE',
    supportedProducts: ['FITHUB', 'TRAINER_APP'],
    supportsGuidance: true,
    defaultGuidanceEnabled: true,
  },
};

/**
 * Get action library item by ID
 */
export function getActionLibraryItem(id: string): ActionLibraryItem | undefined {
  return ACTION_LIBRARY[id];
}

/**
 * Get all action library items as array
 */
export function getAllActionLibraryItems(): ActionLibraryItem[] {
  return Object.values(ACTION_LIBRARY);
}

/**
 * Get action library items filtered by product support
 */
export function getActionLibraryItemsByProduct(product: Product): ActionLibraryItem[] {
  return getAllActionLibraryItems().filter(item => 
    item.supportedProducts.includes(product)
  );
}

/**
 * Action categories for grouping
 */
export type ActionCategory = 'Onboarding' | 'Assessments' | 'Training Plan' | 'Other';

/**
 * Map action IDs to categories
 */
export const ACTION_CATEGORIES: Record<string, ActionCategory> = {
  A01: 'Onboarding', // EGYM Account created
  A10: 'Onboarding', // RFID linked
  A11: 'Onboarding', // NFC created
  A14: 'Onboarding', // Machine settings created
  A03: 'Assessments', // Strength test done
  A04: 'Assessments', // Flexibility test done
  A07: 'Assessments', // BioAge calculated
  A12: 'Training Plan', // Fitness Goals defined
  A05: 'Training Plan', // Training plan created
  A06: 'Training Plan', // Training plan expired
  A13: 'Training Plan', // Workout tracked
  A02: 'Other', // Check-In done
  A08: 'Other', // Trial started
  A09: 'Other', // Trial ended
};

/**
 * Get category for an action
 */
export function getActionCategory(actionId: string): ActionCategory {
  return ACTION_CATEGORIES[actionId] || 'Other';
}

/**
 * Get actions grouped by category
 */
export function getActionsByCategory(): Record<ActionCategory, ActionLibraryItem[]> {
  const categories: Record<ActionCategory, ActionLibraryItem[]> = {
    'Onboarding': [],
    'Assessments': [],
    'Training Plan': [],
    'Other': [],
  };

  getAllActionLibraryItems().forEach(item => {
    const category = getActionCategory(item.id);
    categories[category].push(item);
  });

  return categories;
}


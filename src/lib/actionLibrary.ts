import type { ActionLibraryItem, Product } from './types';

/**
 * Action Library - Predefined action types (A01-A15)
 * These define the available actions that can be added to journeys
 */
export const ACTION_LIBRARY: Record<string, ActionLibraryItem> = {
  A01: {
    id: 'A01',
    title: 'EGYM Account created',
    description: 'Get started with EGYM and track all your data',
    eventType: 'EGYM_ACCOUNT_CREATED',
    completionMode: 'OCCURRENCE',
    supportedProducts: ['BMA', 'FITHUB', 'TRAINER_APP', 'SMART_STRENGTH', 'UNKNOWN'],
    supportsGuidance: true,
    defaultGuidanceEnabled: true,
  },
  A02: {
    id: 'A02',
    title: 'Check-In done',
    description: 'Complete your first check-in at the gym',
    eventType: 'CHECKIN_DONE',
    completionMode: 'OCCURRENCE',
    supportedProducts: ['UNKNOWN'],
    supportsGuidance: false,
    defaultGuidanceEnabled: false,
  },
  A03: {
    id: 'A03',
    title: 'Strength test done',
    description: 'Discover your strength baseline and get personalized recommendations',
    eventType: 'STRENGTH_TEST_DONE',
    completionMode: 'COUNTER',
    supportedProducts: ['SMART_STRENGTH', 'TRAINER_APP', 'BMA'],
    supportsGuidance: true,
    defaultGuidanceEnabled: false,
  },
  A04: {
    id: 'A04',
    title: 'Flexibility test done',
    description: 'Assess your flexibility and improve your mobility',
    eventType: 'FLEXIBILITY_TEST_DONE',
    completionMode: 'COUNTER',
    supportedProducts: ['FITHUB', 'TRAINER_APP', 'BMA'],
    supportsGuidance: true,
    defaultGuidanceEnabled: false,
  },
  A05: {
    id: 'A05',
    title: 'Training plan created',
    description: 'Get your personalized workout plan tailored to your goals',
    eventType: 'TRAINING_PLAN_CREATED',
    completionMode: 'OCCURRENCE',
    supportedProducts: ['BMA', 'TRAINER_APP'],
    supportsGuidance: true,
    defaultGuidanceEnabled: true,
  },
  A06: {
    id: 'A06',
    title: 'Training plan expired',
    description: 'Your training plan has expired, create a new one',
    eventType: 'TRAINING_PLAN_EXPIRED',
    completionMode: 'OCCURRENCE',
    supportedProducts: ['BMA', 'TRAINER_APP'],
    supportsGuidance: false,
    defaultGuidanceEnabled: false,
  },
  A07: {
    id: 'A07',
    title: 'BioAge calculated',
    description: 'Learn your biological age and track your fitness progress',
    eventType: 'BIOAGE_CALCULATED',
    completionMode: 'OCCURRENCE',
    supportedProducts: ['FITHUB', 'BMA', 'TRAINER_APP'],
    supportsGuidance: true,
    defaultGuidanceEnabled: false,
  },
  A08: {
    id: 'A08',
    title: 'Trial started',
    description: 'Start your free trial and explore all features',
    eventType: 'TRIAL_STARTED',
    completionMode: 'OCCURRENCE',
    supportedProducts: ['TRAINER_APP', 'SMART_STRENGTH', 'FITHUB', 'BMA'],
    supportsGuidance: false,
    defaultGuidanceEnabled: false,
  },
  A09: {
    id: 'A09',
    title: 'Trial ended',
    description: 'Your trial period has ended',
    eventType: 'TRIAL_ENDED',
    completionMode: 'OCCURRENCE',
    supportedProducts: ['BMA', 'TRAINER_APP'],
    supportsGuidance: false,
    defaultGuidanceEnabled: false,
  },
  A10: {
    id: 'A10',
    title: 'RFID linked',
    description: 'Link your RFID card for seamless gym access',
    eventType: 'RFID_LINKED',
    completionMode: 'OCCURRENCE',
    supportedProducts: ['FITHUB', 'TRAINER_APP', 'BMA', 'SMART_STRENGTH'],
    supportsGuidance: true,
    defaultGuidanceEnabled: true,
  },
  A11: {
    id: 'A11',
    title: 'NFC created',
    description: 'Set up NFC access for quick and easy check-ins',
    eventType: 'NFC_CREATED',
    completionMode: 'OCCURRENCE',
    supportedProducts: ['BMA', 'TRAINER_APP'],
    supportsGuidance: true,
    defaultGuidanceEnabled: false,
  },
  A12: {
    id: 'A12',
    title: 'Fitness Goals defined',
    description: 'Set your fitness goals and track your progress',
    eventType: 'FITNESS_GOALS_DEFINED',
    completionMode: 'OCCURRENCE',
    supportedProducts: ['BMA', 'FITHUB', 'TRAINER_APP'],
    supportsGuidance: true,
    defaultGuidanceEnabled: true,
  },
  A13: {
    id: 'A13',
    title: 'Workout tracked',
    description: 'Track your workouts and monitor your training progress',
    eventType: 'WORKOUT_TRACKED',
    completionMode: 'COUNTER',
    supportedProducts: ['SMART_STRENGTH', 'BMA', 'TRAINER_APP'],
    supportsGuidance: false,
    defaultGuidanceEnabled: false,
  },
  A14: {
    id: 'A14',
    title: 'Machine settings created',
    description: 'Configure your EGYM machines for personalized workouts',
    eventType: 'MACHINE_SETTINGS_CREATED',
    completionMode: 'OCCURRENCE',
    supportedProducts: ['FITHUB', 'TRAINER_APP'],
    supportsGuidance: true,
    defaultGuidanceEnabled: true,
  },
  A15: {
    id: 'A15',
    title: 'BioAge checked',
    description: 'Check your biological age and track your fitness progress',
    eventType: 'BIOAGE_CHECKED',
    completionMode: 'COUNTER',
    supportedProducts: ['FITHUB', 'BMA', 'TRAINER_APP'],
    supportsGuidance: true,
    defaultGuidanceEnabled: false,
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
  A15: 'Assessments', // BioAge checked
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


import type { Product } from './types';

// Local assets stored in public/icons/ to avoid Figma URL expiry
// To update assets, run: npm run download-assets
// Note: Assets are SVGs but may be saved with different extensions
const fitnessHubIcon = "/icons/fitness-hub.svg";
const smartStrengthIcon = "/icons/smart-strength.svg";
// Removed unused icons: smartFlexIcon, smartCardioIcon
const memberAppIcon = "/icons/member-app.svg";
const trainerAppIcon = "/icons/trainer-app.svg";
const egymSettingsIcon = "/icons/settings.svg";

export interface ProductInfo {
  id: Product;
  label: string;
  icon: string;
}

export const PRODUCT_INFO: Record<Product, ProductInfo> = {
  BMA: {
    id: 'BMA',
    label: 'Member App',
    icon: memberAppIcon,
  },
  FITHUB: {
    id: 'FITHUB',
    label: 'Fitness Hub',
    icon: fitnessHubIcon,
  },
  TRAINER_APP: {
    id: 'TRAINER_APP',
    label: 'Trainer App',
    icon: trainerAppIcon,
  },
  SMART_STRENGTH: {
    id: 'SMART_STRENGTH',
    label: 'Smart Strength',
    icon: smartStrengthIcon,
  },
  MMS: {
    id: 'MMS',
    label: 'MMS',
    icon: egymSettingsIcon,
  },
  UNKNOWN: {
    id: 'UNKNOWN',
    label: 'Unknown',
    icon: egymSettingsIcon,
  },
};

export function getProductInfo(product: Product): ProductInfo {
  return PRODUCT_INFO[product];
}

export function getProductLabel(product: Product): string {
  return PRODUCT_INFO[product]?.label || product;
}


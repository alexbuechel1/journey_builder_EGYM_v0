import type { Product } from './types';

// Figma image assets for products
const fitnessHubIcon = "https://www.figma.com/api/mcp/asset/b4ef17ec-c6e4-493b-8f2a-f950e6c214b2";
const smartStrengthIcon = "https://www.figma.com/api/mcp/asset/cda7135a-2391-462b-846c-26e6864c928c";
// Removed unused icons: smartFlexIcon, smartCardioIcon
const memberAppIcon = "https://www.figma.com/api/mcp/asset/476a42b8-aab1-4790-a540-1680249e641e";
const trainerAppIcon = "https://www.figma.com/api/mcp/asset/15a9e6a1-abf0-43e2-a243-da9bb0a407de";
const egymSettingsIcon = "https://www.figma.com/api/mcp/asset/4e041138-296c-45df-b5f9-8cea64692b94";

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
};

export function getProductInfo(product: Product): ProductInfo {
  return PRODUCT_INFO[product];
}

export function getProductLabel(product: Product): string {
  return PRODUCT_INFO[product]?.label || product;
}


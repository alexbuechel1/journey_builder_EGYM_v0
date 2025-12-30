import type { Product } from './types';

// Figma image assets for products from: https://www.figma.com/design/B5H5AxzPnbGZc665ME1tAO/OX-UI-Kit2025?node-id=269-42612&m=dev
const fitnessHubIcon = "https://www.figma.com/api/mcp/asset/8b32116c-5c7c-428a-8f37-ad0607e47071";
const smartStrengthIcon = "https://www.figma.com/api/mcp/asset/b30bbca4-40bd-4fe7-ae6c-9115b2d35faa";
// Removed unused icons: smartFlexIcon, smartCardioIcon
const memberAppIcon = "https://www.figma.com/api/mcp/asset/054e352f-5934-4a77-a72d-1f98bcbcc99f";
const trainerAppIcon = "https://www.figma.com/api/mcp/asset/73db1358-4bae-40fc-8677-341de437fc0c";
const egymSettingsIcon = "https://www.figma.com/api/mcp/asset/1d488141-24fb-40fa-a602-452b75be0795";

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


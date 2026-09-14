import { EcosystemFlavor } from '../schema';

export const CORE_COMPONENT_DEPENDENCIES: Partial<Record<EcosystemFlavor, string[]>> = {
  react: ['@exhuma/core'],
  nextjs: ['@exhuma/core'],
  vue: ['@exhuma/core'],
  svelte: ['@exhuma/core'],
  solid: ['@exhuma/core'],
  angular: ['@exhuma/core'],
  astro: ['@exhuma/core'],
  vanilla: ['@exhuma/core'],
  'react-native': ['@exhuma/core'],
  flutter: ['exhuma'],
};

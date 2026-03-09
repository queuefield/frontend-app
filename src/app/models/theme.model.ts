export interface ThemeColors {
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Secondary colors
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  
  // Accent colors
  accent: string;
  accentLight: string;
  accentDark: string;
  
  // Background colors
  background: string;
  backgroundLight: string;
  backgroundDark: string;
  
  // Surface colors
  surface: string;
  surfaceLight: string;
  surfaceDark: string;
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
  textOnPrimary: string;
  textOnSecondary: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Border colors
  border: string;
  borderLight: string;
  borderDark: string;
}

export interface ThemeTypography {
  // Font families
  fontFamily: string;
  fontFamilyHeading: string;
  fontFamilyMono: string;
  
  // Font sizes
  fontSizeXs: string;
  fontSizeSm: string;
  fontSizeMd: string;
  fontSizeLg: string;
  fontSizeXl: string;
  fontSize2xl: string;
  fontSize3xl: string;
  fontSize4xl: string;
  
  // Font weights
  fontWeightLight: number;
  fontWeightNormal: number;
  fontWeightMedium: number;
  fontWeightSemibold: number;
  fontWeightBold: number;
  
  // Line heights
  lineHeightTight: number;
  lineHeightNormal: number;
  lineHeightRelaxed: number;
  lineHeightLoose: number;
  
  // Letter spacing
  letterSpacingTight: string;
  letterSpacingNormal: string;
  letterSpacingWide: string;
}

export interface ThemeSpacing {
  // Spacing scale
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  
  // Border radius
  radiusNone: string;
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusXl: string;
  radiusFull: string;
  
  // Shadows
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;
  shadowXl: string;
  shadow2xl: string;
}

export interface ThemeEffects {
  // Transitions
  transitionFast: string;
  transitionBase: string;
  transitionSlow: string;
  
  // Opacity
  opacityDisabled: number;
  opacityHover: number;
  opacityActive: number;
  
  // Z-index
  zIndexDropdown: number;
  zIndexSticky: number;
  zIndexFixed: number;
  zIndexModal: number;
  zIndexPopover: number;
  zIndexTooltip: number;
}

export interface ThemePalette {
  name: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  effects: ThemeEffects;
}

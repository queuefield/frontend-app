export interface ApiUrls {
  baseUrl: string;
  authUrl: string;
  userUrl: string;
  dataUrl: string;
}

export interface Features {
  enableAnalytics: boolean;
  enableLogging: boolean;
  enableDebugMode: boolean;
}

export interface ApplicationInfo {
  name: string;
  version: string;
  supportEmail: string;
  maxUploadSize: number;
  sessionTimeout: number;
}

export interface ThirdPartyConfig {
  googleMapsApiKey: string;
  stripePublicKey: string;
  firebaseConfig: Record<string, any>;
}

export interface ThemePalette {
  name: string;
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    secondaryLight: string;
    secondaryDark: string;
    accent: string;
    accentLight: string;
    accentDark: string;
    background: string;
    backgroundLight: string;
    backgroundDark: string;
    surface: string;
    surfaceLight: string;
    surfaceDark: string;
    textPrimary: string;
    textSecondary: string;
    textDisabled: string;
    textOnPrimary: string;
    textOnSecondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    border: string;
    borderLight: string;
    borderDark: string;
  };
  typography: {
    fontFamily: string;
    fontFamilyHeading: string;
    fontFamilyMono: string;
    fontSizeXs: string;
    fontSizeSm: string;
    fontSizeMd: string;
    fontSizeLg: string;
    fontSizeXl: string;
    fontSize2xl: string;
    fontSize3xl: string;
    fontSize4xl: string;
    fontWeightLight: number;
    fontWeightNormal: number;
    fontWeightMedium: number;
    fontWeightSemibold: number;
    fontWeightBold: number;
    lineHeightTight: number;
    lineHeightNormal: number;
    lineHeightRelaxed: number;
    lineHeightLoose: number;
    letterSpacingTight: string;
    letterSpacingNormal: string;
    letterSpacingWide: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    radiusNone: string;
    radiusSm: string;
    radiusMd: string;
    radiusLg: string;
    radiusXl: string;
    radiusFull: string;
    shadowSm: string;
    shadowMd: string;
    shadowLg: string;
    shadowXl: string;
    shadow2xl: string;
  };
  effects: {
    transitionFast: string;
    transitionBase: string;
    transitionSlow: string;
    opacityDisabled: number;
    opacityHover: number;
    opacityActive: number;
    zIndexDropdown: number;
    zIndexSticky: number;
    zIndexFixed: number;
    zIndexModal: number;
    zIndexPopover: number;
    zIndexTooltip: number;
  };
}

export interface AppConfig {
  environment: string;
  country: string;
  locale: string;
  timezone: string;
  apiUrls: ApiUrls;
  features: Features;
  application: ApplicationInfo;
  thirdParty: ThirdPartyConfig;
  theme: ThemePalette;
  authentication: {
    requireLogin: boolean;
    loginMethod: 'username' | 'phone' | 'otp';
    showRememberMe: boolean;
    tokenExpiryHours: number;
    loginEndpoint: string;
  };
}


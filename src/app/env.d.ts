/// <reference types="next" />
/// <reference types="next/image-types/global" />

/**
 * VEXTONY CORE INFRASTRUCTURE: AMBIENT TYPE DECLARATION SHIELD
 * [STATUS: OMNIPOTENT ULTRA-MAX PRODUCTION LIVE] | [PRIVILEGE: RUNTIME VERIFICATION COMPLIANCE]
 */

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PORT: string;
    readonly VAULT_SECRET_KEY: string;
    readonly NEXT_PUBLIC_APP_URL: string;
    readonly GOOGLE_APPLICATION_CREDENTIALS?: string;
    readonly STRIPE_SECRET_KEY?: string;
  }
}

interface Window {
  readonly ethereum?: any;
  readonly vextony_biometric_cache?: {
    isActive: boolean;
    coordinatesHistory: Array<{ x: number; y: number }>;
    unboundedMetricsVerified: boolean;
  };
}

interface Navigator {
  readonly webdriver?: boolean;
}

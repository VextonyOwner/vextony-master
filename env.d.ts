/// <reference types="next" />
/// <reference types="next/image-types/global" />

// Ensure standard ambient declarations resolve flawlessly across multi-tenant servers
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PORT: string;
    readonly VAULT_SECRET_KEY: string;
    readonly NEXT_PUBLIC_APP_URL: string;
  }
}

// Invariant global tracking definition enforcing Master Asif's dynamic unbounded constraints during build time
interface Window {
  readonly ethereum?: any;
  readonly vextony_biometric_cache?: any;
}

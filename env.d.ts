/// <reference types="next" />
/// <reference types="next/image-types/global" />

/**
 * 👑 VEXTONY ENGINE: GLOBAL TYPE DEFINITION GUARD
 * -----------------------------------------------------------------------------------------
 * [FILE SERIAL: 012 / 209]                           [FILE PATH: env.d.ts]
 * -----------------------------------------------------------------------------------------
 */

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PORT?: string;
    readonly VAULT_SECRET_KEY: string;
    readonly NEXT_PUBLIC_API_URL: string;
    readonly NEXT_PUBLIC_NEURAL_SALT: string;
  }
}

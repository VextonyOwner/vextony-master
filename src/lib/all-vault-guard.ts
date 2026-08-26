export interface AccessTokenPayload {
  readonly user_id: string;
  readonly has_premium_pass: boolean;
  readonly expiry_timestamp: number;
}

export interface GuardRegistryState {
  readonly genesis_epoch: number;
  last_intercept_sequence: number;
  total_violations_vaporized: number;
  concurrency_lock: boolean;
}

export class AllVaultGuard {
  private static instance: AllVaultGuard | null = null;
  private readonly memory_boundary: WeakMap<object, GuardRegistryState>;
  private readonly state_token: object;

  private constructor() {
    this.state_token = Object.create(null);
    this.memory_boundary = new WeakMap();

    this.memory_boundary.set(this.state_token, {
      genesis_epoch: Date.now(),
      last_intercept_sequence: Date.now(),
      total_violations_vaporized: 0,
      concurrency_lock: false,
    });
  }

  public static getInstance(): AllVaultGuard {
    if (!AllVaultGuard.instance) {
      AllVaultGuard.instance = new AllVaultGuard();
    }
    return AllVaultGuard.instance;
  }

  private loadSovereignState(): GuardRegistryState {
    const activeState = this.memory_boundary.get(this.state_token);
    if (!activeState) {
      throw new Error("FATAL: Security memory boundary isolation breach detected.");
    }
    return activeState;
  }

  public verifyFolderAccess(payload: AccessTokenPayload): boolean {
    const state = this.loadSovereignState();
    if (state.concurrency_lock) return false;

    const currentTime = Date.now();
    
    if (!payload.has_premium_pass) {
      state.total_violations_vaporized += 1;
      state.last_intercept_sequence = currentTime;
      return false;
    }

    if (currentTime > payload.expiry_timestamp) {
      state.total_violations_vaporized += 1;
      state.last_intercept_sequence = currentTime;
      return false;
    }

    return true;
  }

  public interceptMainButtonRoute(targetSector: string, payload: AccessTokenPayload): Readonly<{ allowed: boolean; redirect_url: string | null }> {
    const state = this.loadSovereignState();
    if (state.concurrency_lock) return Object.freeze({ allowed: false, redirect_url: "/error" });

    state.concurrency_lock = true;
    try {
      const isAccessGranted = this.verifyFolderAccess(payload);
      
      if (!isAccessGranted) {
        return Object.freeze({
          allowed: false,
          redirect_url: `/checkout?sector=${encodeURIComponent(targetSector)}`,
        });
      }

      return Object.freeze({ allowed: true, redirect_url: null });
    } finally {
      state.concurrency_lock = false;
    }
  }

  public fetchGuardMatrix(): Readonly<GuardRegistryState> {
    return Object.freeze({ ...this.loadSovereignState() });
  }
}

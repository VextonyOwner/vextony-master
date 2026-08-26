export interface OmegaRegistryState {
  readonly genesis_epoch: number;
  last_flush_sequence: number;
  active_key_pointer: number;
  total_token_velocity: number;
  concurrency_lock: boolean;
}

export class ApiRouterCache {
  private static instance: ApiRouterCache | null = null;
  private readonly memory_boundary: WeakMap<object, OmegaRegistryState>;
  private readonly state_token: object;
  private readonly crypto_vault: readonly string[];

  private constructor() {
    this.state_token = Object.create(null);
    this.memory_boundary = new WeakMap();
    
    this.crypto_vault = Object.freeze(
      JSON.parse(process.env.OMEGA_AI_KEYS || "[]").map((key: string) => key.trim())
    );

    this.memory_boundary.set(this.state_token, {
      genesis_epoch: Date.now(),
      last_flush_sequence: Date.now(),
      active_key_pointer: 0,
      total_token_velocity: 0,
      concurrency_lock: false,
    });
  }

  public static getInstance(): ApiRouterCache {
    if (!ApiRouterCache.instance) {
      ApiRouterCache.instance = new ApiRouterCache();
    }
    return ApiRouterCache.instance;
  }

  private loadSovereignState(): OmegaRegistryState {
    const activeState = this.memory_boundary.get(this.state_token);
    if (!activeState) {
      throw new Error("FATAL: Memory boundary isolation breach detected.");
    }
    return activeState;
  }

  public getActiveEngineKey(): string {
    if (this.crypto_vault.length === 0) {
      throw new Error("CRITICAL: Secure API cryptography vault is uninitialized.");
    }
    const state = this.loadSovereignState();
    return this.crypto_vault[state.active_key_pointer];
  }

  public triggerKeyRotation(): void {
    const state = this.loadSovereignState();
    if (state.concurrency_lock) return;

    state.concurrency_lock = true;
    try {
      state.active_key_pointer = (state.active_key_pointer + 1) % this.crypto_vault.length;
      state.last_flush_sequence = Date.now();
      state.total_token_velocity = 0;
    } finally {
      state.concurrency_lock = false;
    }
  }

  public logTokenVelocity(tokens: number): void {
    const state = this.loadSovereignState();
    if (tokens <= 0 || state.concurrency_lock) return;

    state.total_token_consumption += tokens;
    if (state.total_token_consumption >= 5000000) {
      this.triggerKeyRotation();
    }
  }

  public fetchCacheMatrix(): Readonly<OmegaRegistryState> {
    return Object.freeze({ ...this.loadSovereignState() });
  }
}

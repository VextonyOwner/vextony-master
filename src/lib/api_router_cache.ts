import { EventEmitter } from "events";

export interface OmegaRegistryState {
  readonly genesis_epoch: number;
  last_flush_sequence: number;
  active_key_pointer: number;
  total_token_consumption: number;
  concurrency_lock: boolean;
  rolling_delta_ms: number;
  throttle_active: boolean;
}

export interface MetricSnapshot {
  timestamp: string;
  allocated_key_index: number;
  current_velocity: number;
  system_load_factor: number;
}

export class ApiRouterCache extends EventEmitter {
  private static instance: ApiRouterCache | null = null;
  private readonly memory_boundary: WeakMap<object, OmegaRegistryState>;
  private readonly transient_metrics: Map<string, MetricSnapshot[]>;
  private readonly state_token: object;
  private readonly crypto_vault: readonly string[];
  private readonly execution_limits: Readonly<{ max_token_velocity: number; window_ms: number }>;

  private constructor() {
    super();
    this.setMaxListeners(100);
    this.state_token = Object.create(null);
    this.memory_boundary = new WeakMap();
    this.transient_metrics = new Map();
    
    this.execution_limits = Object.freeze({
      max_token_velocity: 5000000,
      window_ms: 60000,
    });

    this.crypto_vault = Object.freeze(
      JSON.parse(process.env.OMEGA_AI_KEYS || "[]").map((key: string) => {
        if (!key || key.trim().length < 10) {
          throw new Error("FATAL: Crypto vault detected compromised or malformed token format.");
        }
        return key.trim();
      })
    );

    this.memory_boundary.set(this.state_token, {
      genesis_epoch: Date.now(),
      last_flush_sequence: Date.now(),
      active_key_pointer: 0,
      total_token_consumption: 0,
      concurrency_lock: false,
      rolling_delta_ms: 0,
      throttle_active: false,
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
      this.emit("CRITICAL_FAULT", "Memory boundary isolation breach detected.");
      throw new Error("FATAL: Memory boundary isolation breach detected.");
    }
    return activeState;
  }

  public getActiveEngineKey(): string {
    if (this.crypto_vault.length === 0) {
      this.emit("VAULT_EMPTY_ERROR", "Secure API cryptography vault is uninitialized.");
      throw new Error("CRITICAL: Secure API cryptography vault is uninitialized.");
    }
    const state = this.loadSovereignState();
    this.captureMetricSnapshot(state);
    return this.crypto_vault[state.active_key_pointer];
  }

  public triggerKeyRotation(): void {
    const state = this.loadSovereignState();
    if (state.concurrency_lock) return;

    state.concurrency_lock = true;
    const startTimestamp = Date.now();

    try {
      const currentPointer = state.active_key_pointer;
      state.active_key_pointer = (state.active_key_pointer + 1) % this.crypto_vault.length;
      state.last_flush_sequence = Date.now();
      state.total_token_consumption = 0;
      state.rolling_delta_ms = Date.now() - startTimestamp;

      this.emit("KEY_ROTATED_SUCCESSFULLY", {
        previous_node: currentPointer,
        active_node: state.active_key_pointer,
        latency_ms: state.rolling_delta_ms,
      });
    } catch (error: any) {
      this.emit("ROTATION_FAILURE", error.message);
    } finally {
      state.concurrency_lock = false;
    }
  }

  public logTokenVelocity(tokens: number): void {
    const state = this.loadSovereignState();
    if (tokens <= 0 || state.concurrency_lock) return;

    state.total_token_consumption += tokens;
    
    if (state.total_token_consumption >= this.execution_limits.max_token_velocity) {
      this.emit("QUOTA_THRESHOLD_EXCEEDED", { current_load: state.total_token_consumption });
      this.triggerKeyRotation();
    }
  }

  private captureMetricSnapshot(state: OmegaRegistryState): void {
    const currentISO = new Date().toISOString();
    const activeDomainKey = `domain_node_${(state.active_key_pointer + 1).toString().padStart(2, "0")}`;
    const targetPool = this.transient_metrics.get(activeDomainKey) || [];

    const snapshot: MetricSnapshot = {
      timestamp: currentISO,
      allocated_key_index: state.active_key_pointer,
      current_velocity: state.total_token_consumption,
      system_load_factor: state.total_token_consumption / this.execution_limits.max_token_velocity,
    };

    targetPool.push(snapshot);

    if (targetPool.length > 200) {
      targetPool.shift();
    }
    
    this.transient_metrics.set(activeDomainKey, targetPool);
  }

  public forceMemoryPurge(): void {
    const state = this.loadSovereignState();
    state.concurrency_lock = true;
    try {
      this.transient_metrics.clear();
      state.total_token_consumption = 0;
      state.last_flush_sequence = Date.now();
      this.emit("TRANSIENT_MEMORY_FLUSHED");
    } finally {
      state.concurrency_lock = false;
    }
  }

  public fetchCacheMatrix(): Readonly<OmegaRegistryState> {
    return Object.freeze({ ...this.loadSovereignState() });
  }

  public fetchLiveMetrics(domainKey: string): readonly MetricSnapshot[] {
    return Object.freeze([...(this.transient_metrics.get(domainKey) || [])]);
  }
}

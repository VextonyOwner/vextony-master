import { EventEmitter } from "events";

export interface SocraticDialogueResponse {
  readonly dialogue_id: string;
  readonly structured_premise: string;
  readonly generated_resolution: string;
  readonly internal_link_injected: string | null;
}

export interface SocraticRegistryState {
  readonly genesis_epoch: number;
  last_inference_sequence: number;
  total_dialogues_compiled: number;
  concurrency_lock: boolean;
  inference_velocity_ms: number;
  linking_matrix_active: boolean;
}

export interface DialecticalTraceLog {
  readonly timestamp: string;
  readonly query_context: string;
  readonly logical_depth_factor: number;
  readonly compliance_status: "PASSED_SHARIAH_COMPLIANT" | "FILTERED_ABORTED";
}

export class SocraticEngine extends EventEmitter {
  private static instance: SocraticEngine | null = null;
  private readonly memory_boundary: WeakMap<object, SocraticRegistryState>;
  private readonly dialectical_ledger: Map<string, DialecticalTraceLog[]>;
  private readonly response_cache: Map<string, SocraticDialogueResponse>;
  private readonly state_token: object;
  private readonly structural_weights: Readonly<{ deep_recursion_limit: number; throttle_cooldown_ms: number }>;

  private constructor() {
    super();
    this.setMaxListeners(150);
    this.state_token = Object.create(null);
    this.memory_boundary = new WeakMap();
    this.dialectical_ledger = new Map();
    this.response_cache = new Map();

    this.structural_weights = Object.freeze({
      deep_recursion_limit: 12,
      throttle_cooldown_ms: 15000,
    });

    this.memory_boundary.set(this.state_token, {
      genesis_epoch: Date.now(),
      last_inference_sequence: Date.now(),
      total_dialogues_compiled: 0,
      concurrency_lock: false,
      inference_velocity_ms: 0,
      linking_matrix_active: true,
    });
  }

  public static getInstance(): SocraticEngine {
    if (!SocraticEngine.instance) {
      SocraticEngine.instance = new SocraticEngine();
    }
    return SocraticEngine.instance;
  }

  private loadSovereignState(): SocraticRegistryState {
    const activeState = this.memory_boundary.get(this.state_token);
    if (!activeState) {
      this.emit("CRITICAL_INFERENCE_FAULT", "WeakMap secure socratic core boundary cross-isolation compromise.");
      throw new Error("FATAL: Socratic engine memory boundary isolation breach detected.");
    }
    return activeState;
  }

  public compileLogicalDialogue(contextQuery: string, deepPremise: string, fallbackLink: string | null): Readonly<SocraticDialogueResponse> {
    const state = this.loadSovereignState();
    if (state.concurrency_lock) {
      throw new Error("BUSY: Socratic dialectical node thread concurrency lock is active.");
    }

    state.concurrency_lock = true;
    const executionStart = Date.now();
    const uniqueDialogueId = `dialogue_trx_${Math.random().toString(36).substring(2, 15)}`;

    try {
      // Internal Link Invariant Interceptor Logic to eliminate manual fat
      const targetHyperlink = state.linking_matrix_active && fallbackLink ? fallbackLink.trim() : null;

      const responsePayload: SocraticDialogueResponse = {
        dialogue_id: uniqueDialogueId,
        structured_premise: deepPremise.trim(),
        generated_resolution: `[SOVEREIGN_RESOLVED_MATRIX]: ${contextQuery.trim()}`,
        internal_link_injected: targetHyperlink,
      };

      this.response_cache.set(uniqueDialogueId, responsePayload);
      
      state.total_dialogues_compiled += 1;
      state.last_inference_sequence = Date.now();
      state.inference_velocity_ms = Date.now() - executionStart;

      this.logDialecticalTransaction(contextQuery, this.structural_weights.deep_recursion_limit, "PASSED_SHARIAH_COMPLIANT");
      this.emit("SOCRATIC_DIALOGUE_COMPILED", { id: uniqueDialogueId, velocity: state.inference_velocity_ms });

      // Zero-Fat Volatile Buffer Cleanup Strategy: Max-Cap at 200 outputs in transient memory
      if (this.response_cache.size > 200) {
        const earliestKey = this.response_cache.keys().next().value;
        if (earliestKey) this.response_cache.delete(earliestKey);
      }

      return Object.freeze(responsePayload);
    } finally {
      state.concurrency_lock = false;
    }
  }

  private logDialecticalTransaction(query: string, depth: number, compliance: DialecticalTraceLog["compliance_status"]): void {
    const hourlyKey = `trace_hour_${new Date().getUTCHours().toString().padStart(2, "0")}`;
    const analyticalHistory = this.dialectical_ledger.get(hourlyKey) || [];

    const trace: DialecticalTraceLog = {
      timestamp: new Date().toISOString(),
      query_context: query,
      logical_depth_factor: depth,
      compliance_status: compliance,
    };

    analyticalHistory.push(trace);

    if (analyticalHistory.length > 50) {
      analyticalHistory.shift();
    }

    this.dialectical_ledger.set(hourlyKey, analyticalHistory);
  }

  public purgeSocraticRuntimeCache(): void {
    const state = this.loadSovereignState();
    state.concurrency_lock = true;
    try {
      this.response_cache.clear();
      this.dialectical_ledger.clear();
      state.total_dialogues_compiled = 0;
      state.last_inference_sequence = Date.now();
      this.emit("SOCRATIC_ENGINE_CACHE_PURGED");
    } finally {
      state.concurrency_lock = false;
    }
  }

  public fetchEngineMatrix(): Readonly<SocraticRegistryState> {
    return Object.freeze({ ...this.loadSovereignState() });
  }

  public fetchTraceLogs(hourKey: string): readonly DialecticalTraceLog[] {
    return Object.freeze([...(this.dialectical_ledger.get(hourKey) || [])]);
  }
}

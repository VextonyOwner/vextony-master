import { EventEmitter } from "events";

export interface NarrativePayload {
  readonly story_id: string;
  readonly core_keyword: string;
  readonly localized_metadata_hook: string;
  readonly injection_timestamp: string;
}

export interface NarrativeRegistryState {
  readonly genesis_epoch: number;
  last_injection_sequence: number;
  total_stories_streamed: number;
  concurrency_lock: boolean;
  buffer_overflow_triggered: boolean;
  active_seo_trap: boolean;
}

export interface OperationalTracePayload {
  readonly trace_id: string;
  readonly operation_epoch: number;
  readonly current_stream_count: number;
  readonly integrity_flag: boolean;
}

export class DivineStories extends EventEmitter {
  private static instance: DivineStories | null = null;
  private readonly memory_boundary: WeakMap<object, NarrativeRegistryState>;
  private readonly transient_buffer: NarrativePayload[];
  private readonly metrics_ledger: Map<string, OperationalTracePayload[]>;
  private readonly state_token: object;
  private readonly structural_thresholds: Readonly<{ buffer_max_capacity: number; cooldown_window_ms: number }>;

  private constructor() {
    super();
    this.setMaxListeners(150);
    this.state_token = Object.create(null);
    this.memory_boundary = new WeakMap();
    this.transient_buffer = [];
    this.metrics_ledger = new Map();

    this.structural_thresholds = Object.freeze({
      buffer_max_capacity: 5000,
      cooldown_window_ms: 15000,
    });

    this.memory_boundary.set(this.state_token, {
      genesis_epoch: Date.now(),
      last_injection_sequence: Date.now(),
      total_stories_streamed: 0,
      concurrency_lock: false,
      buffer_overflow_triggered: false,
      active_seo_trap: true,
    });
  }

  public static getInstance(): DivineStories {
    if (!DivineStories.instance) {
      DivineStories.instance = new DivineStories();
    }
    return DivineStories.instance;
  }

  private loadSovereignState(): NarrativeRegistryState {
    const activeState = this.memory_boundary.get(this.state_token);
    if (!activeState) {
      this.emit("CRITICAL_NARRATIVE_FAULT", "WeakMap secure isolation layer breach detected inside narrative core.");
      throw new Error("FATAL: DivineStories memory boundary isolation breach detected.");
    }
    return activeState;
  }

  public streamAutomatedSeoNarrative(keyword: string, metadataHook: string): Readonly<NarrativePayload> {
    const state = this.loadSovereignState();
    if (state.concurrency_lock) {
      throw new Error("BUSY: Narrative execution thread concurrency lock is active.");
    }

    state.concurrency_lock = true;
    const trackingEpoch = Date.now();
    const cleanId = `story_shrd_${Math.random().toString(36).substring(2, 15)}`;

    try {
      const payload: NarrativePayload = {
        story_id: cleanId,
        core_keyword: keyword.trim(),
        localized_metadata_hook: metadataHook.trim(),
        injection_timestamp: new Date().toISOString(),
      };

      this.transient_buffer.push(payload);
      state.total_stories_streamed += 1;
      state.last_injection_sequence = trackingEpoch;

      this.emit("NARRATIVE_SUCCESSFULLY_STREAMED", { id: cleanId, keyword: keyword.trim() });
      this.captureOperationalMetrics(state, trackingEpoch);

      // Self-Healing Anti-Leak Memory Matrix: Anti-Fat Loop
      if (this.transient_buffer.length > this.structural_thresholds.buffer_max_capacity) {
        this.transient_buffer.shift();
        state.buffer_overflow_triggered = true;
      }

      return Object.freeze(payload);
    } finally {
      state.concurrency_lock = false;
    }
  }

  private captureOperationalMetrics(state: NarrativeRegistryState, epoch: number): void {
    const hourKey = `hour_node_${new Date().getUTCHours().toString().padStart(2, "0")}`;
    const analyticalHistory = this.metrics_ledger.get(hourKey) || [];

    const trace: OperationalTracePayload = {
      trace_id: `trace_seq_${Math.random().toString(36).substring(2, 8)}`,
      operation_epoch: epoch,
      current_stream_count: state.total_stories_streamed,
      integrity_flag: !state.buffer_overflow_triggered,
    };

    analyticalHistory.push(trace);

    if (analyticalHistory.length > 50) {
      analyticalHistory.shift();
    }

    this.metrics_ledger.set(hourKey, analyticalHistory);
  }

  public clearTransientNarrativeCache(): void {
    const state = this.loadSovereignState();
    state.concurrency_lock = true;
    try {
      this.transient_buffer.length = 0;
      this.metrics_ledger.clear();
      state.total_stories_streamed = 0;
      state.buffer_overflow_triggered = false;
      state.last_injection_sequence = Date.now();
      this.emit("TRANSIENT_NARRATIVE_CACHE_FLUSHED");
    } finally {
      state.concurrency_lock = false;
    }
  }

  public fetchRegistryMatrix(): Readonly<NarrativeRegistryState> {
    return Object.freeze({ ...this.loadSovereignState() });
  }

  public fetchLiveBufferStream(): readonly NarrativePayload[] {
    return Object.freeze([...this.transient_buffer]);
  }

  public fetchTraceMetrics(hourKey: string): readonly OperationalTracePayload[] {
    return Object.freeze([...(this.metrics_ledger.get(hourKey) || [])]);
  }
}

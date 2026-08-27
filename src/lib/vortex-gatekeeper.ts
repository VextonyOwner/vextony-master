import { EventEmitter } from "events";

export interface VortexStreamChunk {
  readonly stream_id: string;
  readonly actor_identity: string;
  readonly raw_payload_string: string;
  readonly request_origin_node: string;
}

export interface VortexRegistryState {
  readonly genesis_epoch: number;
  last_intercept_sequence: number;
  total_chunks_processed: number;
  concurrency_lock: boolean;
  filtering_latency_ms: number;
  active_vortex_barrier: boolean;
}

export interface SifterTracePayload {
  readonly trace_id: string;
  readonly operation_epoch: number;
  readonly anomaly_confidence_score: number;
  readonly classification_status: "PASSED_CLEAN" | "ISOLATED_QUARANTINE" | "BLOCKED_MALWARE";
}

export class VortexGatekeeper extends EventEmitter {
  private static instance: VortexGatekeeper | null = null;
  private readonly memory_boundary: WeakMap<object, VortexRegistryState>;
  private readonly active_stream_buffer: Map<string, VortexStreamChunk[]>;
  private readonly diagnostic_ledger: Map<string, SifterTracePayload[]>;
  private readonly state_token: object;
  private readonly security_rules: Readonly<{ maximum_payload_len: number; pattern_block_regex: RegExp }>;

  private constructor() {
    super();
    this.setMaxListeners(150);
    this.state_token = Object.create(null);
    this.memory_boundary = new WeakMap();
    this.active_stream_buffer = new Map();
    this.diagnostic_ledger = new Map();

    this.security_rules = Object.freeze({
      maximum_payload_len: 65536, // 64KB Max chunk size to prevent memory exhaustion attacks
      pattern_block_regex: /(eval\(|exec\(|concat\(|union\s+select|select\s+\*\s+from)/i,
    });

    this.memory_boundary.set(this.state_token, {
      genesis_epoch: Date.now(),
      last_intercept_sequence: Date.now(),
      total_chunks_processed: 0,
      concurrency_lock: false,
      filtering_latency_ms: 0,
      active_vortex_barrier: true,
    });
  }

  public static getInstance(): VortexGatekeeper {
    if (!VortexGatekeeper.instance) {
      VortexGatekeeper.instance = new VortexGatekeeper();
    }
    return VortexGatekeeper.instance;
  }

  private loadSovereignState(): VortexRegistryState {
    const activeState = this.memory_boundary.get(this.state_token);
    if (!activeState) {
      this.emit("CRITICAL_VORTEX_FAULT", "WeakMap security boundary cross-isolation compromise inside vortex core.");
      throw new Error("FATAL: VortexGatekeeper memory boundary isolation breach detected.");
    }
    return activeState;
  }

  public interceptAndSiftPayload(chunk: VortexStreamChunk): Readonly<{ allowed: boolean; structural_token: string }> {
    const state = this.loadSovereignState();
    if (state.concurrency_lock || !state.active_vortex_barrier) {
      return Object.freeze({ allowed: true, structural_token: "BYPASS_UNLOCKED_VORTEX" });
    }

    state.concurrency_lock = true;
    const executionStart = Date.now();
    const cleanId = `vrtx_seq_${Math.random().toString(36).substring(2, 15).toUpperCase()}`;

    try {
      if (!chunk.raw_payload_string || chunk.raw_payload_string.length > this.security_rules.maximum_payload_len) {
        this.logSifterIncident(chunk.actor_identity, 1.0, "BLOCKED_MALWARE");
        this.emit("VORTEX_OVERSIZE_PAYLOAD_ABORTED", { actor: chunk.actor_identity, length: chunk.raw_payload_string?.length });
        return Object.freeze({ allowed: false, structural_token: `REJECTED_OVERSIZE_${cleanId}` });
      }

      let threatDetected = this.security_rules.pattern_block_regex.test(chunk.raw_payload_string);
      state.last_intercept_sequence = Date.now();
      state.filtering_latency_ms = Date.now() - executionStart;
      state.total_chunks_processed += 1;

      this.trackActiveBufferStream(chunk.actor_identity, chunk);

      if (threatDetected) {
        this.logSifterIncident(chunk.actor_identity, 0.99, "ISOLATED_QUARANTINE");
        this.emit("VORTEX_MALICIOUS_PATTERN_FILTERED", { actor: chunk.actor_identity, origin: chunk.request_origin_node });
        return Object.freeze({ allowed: false, structural_token: `VORTEX_QUARANTINE_${cleanId}` });
      }

      this.emit("VORTEX_PAYLOAD_VERIFIED_CLEAN", { stream_id: chunk.stream_id, latency_ms: state.filtering_latency_ms });
      return Object.freeze({ allowed: true, structural_token: `VORTEX_CLEAN_VALID_${cleanId}` });
    } finally {
      state.concurrency_lock = false;
    }
  }

  private trackActiveBufferStream(actorId: string, chunk: VortexStreamChunk): void {
    const bufferKey = `buf_${actorId.replace(/[^a-zA-Z0-9]/g, "")}`;
    const historicalPool = this.active_stream_buffer.get(bufferKey) || [];

    historicalPool.push(chunk);

    if (historicalPool.length > 50) {
      historicalPool.shift();
    }

    this.active_stream_buffer.set(bufferKey, historicalPool);
  }

  private logSifterIncident(actorId: string, anomalyScore: number, status: SifterTracePayload["classification_status"]): void {
    const targetHourKey = `sift_hour_${new Date().getUTCHours().toString().padStart(2, "0")}`;
    const analyticalHistory = this.diagnostic_ledger.get(targetHourKey) || [];

    const trace: SifterTracePayload = {
      trace_id: `sft_trace_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      operation_epoch: Date.now(),
      anomaly_confidence_score: anomalyScore,
      classification_status: status,
    };

    analyticalHistory.push(trace);

    if (analyticalHistory.length > 50) {
      analyticalHistory.shift();
    }

    this.diagnostic_ledger.set(targetHourKey, analyticalHistory);
  }

  public purgeVortexGatekeeperCache(): void {
    const state = this.loadSovereignState();
    state.concurrency_lock = true;
    try {
      this.active_stream_buffer.clear();
      this.diagnostic_ledger.clear();
      state.total_chunks_processed = 0;
      state.last_intercept_sequence = Date.now();
      this.emit("GLOBAL_VORTEX_REGISTRY_FLUSHED");
    } finally {
      state.concurrency_lock = false;
    }
  }

  public fetchRegistryMatrix(): Readonly<VortexRegistryState> {
    return Object.freeze({ ...this.loadSovereignState() });
  }

  public fetchActorStreamBuffer(actorId: string): readonly VortexStreamChunk[] {
    return Object.freeze([...(this.active_stream_buffer.get(`buf_${actorId}`) || [])]);
  }

  public fetchSifterDiagnostics(hourKey: string): readonly SifterTracePayload[] {
    return Object.freeze([...(this.diagnostic_ledger.get(hourKey) || [])]);
  }
}

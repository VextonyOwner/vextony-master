import { EventEmitter } from "events";

export interface TrailLog {
  readonly timestamp: string;
  readonly event_type: "CONTENT_DISPATCH" | "ACCESS_DENIED" | "KEY_ROTATION" | "SHARIAH_VIOLATION_VAPORIZED";
  readonly actor: string;
  readonly metadata_summary: string;
}

export interface LogRegistryState {
  readonly genesis_epoch: number;
  last_write_sequence: number;
  concurrency_lock: boolean;
  total_logs_written: number;
  rolling_buffer_overflow: boolean;
}

export interface OperationalMetricPayload {
  readonly node_id: string;
  readonly processed_logs_count: number;
  readonly last_event_type: string;
}

export class AllSystemLogs extends EventEmitter {
  private static instance: AllSystemLogs | null = null;
  private readonly memory_boundary: WeakMap<object, LogRegistryState>;
  private readonly transient_ledger: TrailLog[];
  private readonly systemic_snapshots: Map<string, OperationalMetricPayload[]>;
  private readonly state_token: object;
  private readonly execution_thresholds: Readonly<{ max_buffer_capacity: number; flush_window_ms: number }>;

  private constructor() {
    super();
    this.setMaxListeners(150);
    this.state_token = Object.create(null);
    this.memory_boundary = new WeakMap();
    this.transient_ledger = [];
    this.systemic_snapshots = new Map();

    this.execution_thresholds = Object.freeze({
      max_buffer_capacity: 5000,
      flush_window_ms: 10000,
    });

    this.memory_boundary.set(this.state_token, {
      genesis_epoch: Date.now(),
      last_write_sequence: Date.now(),
      concurrency_lock: false,
      total_logs_written: 0,
      rolling_buffer_overflow: false,
    });
  }

  public static getInstance(): AllSystemLogs {
    if (!AllSystemLogs.instance) {
      AllSystemLogs.instance = new AllSystemLogs();
    }
    return AllSystemLogs.instance;
  }

  private loadSovereignState(): LogRegistryState {
    const activeState = this.memory_boundary.get(this.state_token);
    if (!activeState) {
      this.emit("CRITICAL_LOGGING_FAULT", "WeakMap secure isolation layer breach detected.");
      throw new Error("FATAL: Audit memory boundary isolation breach detected.");
    }
    return activeState;
  }

  public writeLog(event: TrailLog["event_type"], actor: string, details: string): void {
    const state = this.loadSovereignState();
    if (state.concurrency_lock) return;

    state.concurrency_lock = true;
    try {
      const newLog: TrailLog = {
        timestamp: new Date().toISOString(),
        event_type: event,
        actor: actor,
        metadata_summary: details,
      };
      
      this.transient_ledger.push(newLog);
      state.last_write_sequence = Date.now();
      state.total_logs_written += 1;
      
      this.emit("LOG_APPENDED_EVENT", { type: event, actor: actor });
      this.captureOperationalMetrics(state, event);

      // Self-Healing Memory Optimization Matrix: Anti-Fat Loop
      if (this.transient_ledger.length > this.execution_thresholds.max_buffer_capacity) {
        this.transient_ledger.shift();
        state.rolling_buffer_overflow = true;
      }
    } finally {
      state.concurrency_lock = false;
    }
  }

  private captureOperationalMetrics(state: LogRegistryState, currentEvent: string): void {
    const metricKey = `audit_node_${new Date().getUTCHours().toString().padStart(2, "0")}`;
    const historicalMetrics = this.systemic_snapshots.get(metricKey) || [];

    const payload: OperationalMetricPayload = {
      node_id: metricKey,
      processed_logs_count: state.total_logs_written,
      last_event_type: currentEvent,
    };

    historicalMetrics.push(payload);

    if (historicalMetrics.length > 50) {
      historicalMetrics.shift();
    }

    this.systemic_snapshots.set(metricKey, historicalMetrics);
  }

  public forceSystemLogsFlush(): void {
    const state = this.loadSovereignState();
    state.concurrency_lock = true;
    try {
      this.transient_ledger.length = 0;
      this.systemic_snapshots.clear();
      state.total_logs_written = 0;
      state.rolling_buffer_overflow = false;
      state.last_write_sequence = Date.now();
      this.emit("GLOBAL_SYSTEM_LOGS_FLUSHED");
    } finally {
      state.concurrency_lock = false;
    }
  }

  public exportAuditTrail(): readonly TrailLog[] {
    return Object.freeze([...this.transient_ledger]);
  }

  public fetchLogMatrix(): Readonly<LogRegistryState> {
    return Object.freeze({ ...this.loadSovereignState() });
  }

  public fetchNodeMetrics(metricHourKey: string): readonly OperationalMetricPayload[] {
    return Object.freeze([...(this.systemic_snapshots.get(metricHourKey) || [])]);
  }
}

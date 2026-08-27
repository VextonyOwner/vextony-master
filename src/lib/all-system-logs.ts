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
}

export class AllSystemLogs {
  private static instance: AllSystemLogs | null = null;
  private readonly memory_boundary: WeakMap<object, LogRegistryState>;
  private readonly transient_ledger: TrailLog[];
  private readonly state_token: object;

  private constructor() {
    this.state_token = Object.create(null);
    this.memory_boundary = new WeakMap();
    this.transient_ledger = [];

    this.memory_boundary.set(this.state_token, {
      genesis_epoch: Date.now(),
      last_write_sequence: Date.now(),
      concurrency_lock: false,
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
      
      // Silicon Valley Zero-Fat Memory Management: Max-Cap at 5000 clean records
      if (this.transient_ledger.length > 5000) {
        this.transient_ledger.shift();
      }
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
}

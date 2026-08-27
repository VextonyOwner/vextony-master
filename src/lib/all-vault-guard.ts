import { EventEmitter } from "events";

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
  interception_latency_ms: number;
  active_anomaly_shield: boolean;
}

export interface SecurityViolationLog {
  readonly timestamp: string;
  readonly target_sector: string;
  readonly invalid_actor_id: string;
  readonly classification: "NO_PREMIUM_PASS" | "EXPIRED_SESSION_TOKEN" | "CONCURRENCY_ABUSE";
}

export class AllVaultGuard extends EventEmitter {
  private static instance: AllVaultGuard | null = null;
  private readonly memory_boundary: WeakMap<object, GuardRegistryState>;
  private readonly violation_ledger: Map<string, SecurityViolationLog[]>;
  private readonly state_token: object;
  private readonly structural_thresholds: Readonly<{ max_allowed_violations: number; cooldown_ms: number }>;

  private constructor() {
    super();
    this.setMaxListeners(100);
    this.state_token = Object.create(null);
    this.memory_boundary = new WeakMap();
    this.violation_ledger = new Map();

    this.structural_thresholds = Object.freeze({
      max_allowed_violations: 500,
      cooldown_ms: 30000,
    });

    this.memory_boundary.set(this.state_token, {
      genesis_epoch: Date.now(),
      last_intercept_sequence: Date.now(),
      total_violations_vaporized: 0,
      concurrency_lock: false,
      interception_latency_ms: 0,
      active_anomaly_shield: false,
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
      this.emit("CRITICAL_SECURITY_BREACH", "WeakMap memory boundary cross-isolation compromise.");
      throw new Error("FATAL: Security memory boundary isolation breach detected.");
    }
    return activeState;
  }

  public verifyFolderAccess(payload: AccessTokenPayload, sectorKey: string): boolean {
    const state = this.loadSovereignState();
    if (state.concurrency_lock) return false;

    const currentTime = Date.now();
    
    if (!payload.has_premium_pass) {
      this.logViolation(sectorKey, payload.user_id, "NO_PREMIUM_PASS");
      state.total_violations_vaporized += 1;
      state.last_intercept_sequence = currentTime;
      return false;
    }

    if (currentTime > payload.expiry_timestamp) {
      this.logViolation(sectorKey, payload.user_id, "EXPIRED_SESSION_TOKEN");
      state.total_violations_vaporized += 1;
      state.last_intercept_sequence = currentTime;
      return false;
    }

    return true;
  }

  public interceptMainButtonRoute(targetSector: string, payload: AccessTokenPayload): Readonly<{ allowed: boolean; redirect_url: string | null }> {
    const state = this.loadSovereignState();
    if (state.concurrency_lock) {
      return Object.freeze({ allowed: false, redirect_url: "/error?cause=thread_lock" });
    }

    state.concurrency_lock = true;
    const executionStart = Date.now();

    try {
      const isAccessGranted = this.verifyFolderAccess(payload, targetSector);
      state.interception_latency_ms = Date.now() - executionStart;
      
      if (!isAccessGranted) {
        this.emit("GATE_ACCESS_DENIED", { actor: payload.user_id, sector: targetSector });
        return Object.freeze({
          allowed: false,
          redirect_url: `/checkout?sector=${encodeURIComponent(targetSector)}`,
        });
      }

      this.emit("GATE_ACCESS_GRANTED", { actor: payload.user_id, sector: targetSector });
      return Object.freeze({ allowed: true, redirect_url: null });
    } catch (error: any) {
      this.emit("GUARD_RUNTIME_FAULT", error.message);
      return Object.freeze({ allowed: false, redirect_url: "/error" });
    } finally {
      state.concurrency_lock = false;
    }
  }

  private logViolation(sector: string, actorId: string, type: SecurityViolationLog["classification"]): void {
    const actorKey = `actor_${actorId.replace(/[^a-zA-Z0-9]/g, "")}`;
    const historicalLogs = this.violation_ledger.get(actorKey) || [];

    const record: SecurityViolationLog = {
      timestamp: new Date().toISOString(),
      target_sector: sector,
      invalid_actor_id: actorId,
      classification: type,
    };

    historicalLogs.push(record);

    if (historicalLogs.length > 50) {
      historicalLogs.shift();
    }

    this.violation_ledger.set(actorKey, historicalLogs);
    
    const state = this.loadSovereignState();
    if (state.total_violations_vaporized >= this.structural_thresholds.max_allowed_violations) {
      state.active_anomaly_shield = true;
      this.emit("ANOMALY_DDoS_ALERT_TRIGGERED", { violations_count: state.total_violations_vaporized });
    }
  }

  public clearSecurityLogs(): void {
    const state = this.loadSovereignState();
    state.concurrency_lock = true;
    try {
      this.violation_ledger.clear();
      state.total_violations_vaporized = 0;
      state.active_anomaly_shield = false;
      this.emit("SECURITY_LEDGER_PURGED");
    } finally {
      state.concurrency_lock = false;
    }
  }

  public fetchGuardMatrix(): Readonly<GuardRegistryState> {
    return Object.freeze({ ...this.loadSovereignState() });
  }

  public fetchActorViolations(actorId: string): readonly SecurityViolationLog[] {
    return Object.freeze([...(this.violation_ledger.get(`actor_${actorId}`) || [])]);
  }
}

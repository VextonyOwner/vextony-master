import { EventEmitter } from "events";

export interface WafSecurityPayload {
  readonly request_id: string;
  readonly client_ip: string;
  readonly target_uri: string;
  readonly http_method: string;
  readonly edge_region: string;
}

export interface GatekeeperRegistryState {
  readonly genesis_epoch: number;
  last_intercept_sequence: number;
  total_threats_neutralized: number;
  concurrency_lock: boolean;
  edge_delta_latency_ms: number;
  firewall_shield_active: boolean;
}

export interface IncidentAuditFrame {
  readonly timestamp: string;
  readonly dynamic_ip: string;
  readonly signature_classification: "MALICIOUS_DDoS_BURST" | "ILLEGAL_URI_TRAVERSAL" | "CONCURRENCY_VIOLATION";
}

export class VercelGatekeeper extends EventEmitter {
  private static instance: VercelGatekeeper | null = null;
  private readonly memory_boundary: WeakMap<object, GatekeeperRegistryState>;
  private readonly transient_incident_log: Map<string, IncidentAuditFrame[]>;
  private readonly state_token: object;
  private readonly structural_thresholds: Readonly<{ security_max_burst: number; cooldown_window_ms: number }>;

  private constructor() {
    super();
    this.setMaxListeners(150);
    this.state_token = Object.create(null);
    this.memory_boundary = new WeakMap();
    this.transient_incident_log = new Map();

    this.structural_thresholds = Object.freeze({
      security_max_burst: 1000,
      cooldown_window_ms: 10000,
    });

    this.memory_boundary.set(this.state_token, {
      genesis_epoch: Date.now(),
      last_intercept_sequence: Date.now(),
      total_threats_neutralized: 0,
      concurrency_lock: false,
      edge_delta_latency_ms: 0,
      firewall_shield_active: true,
    });
  }

  public static getInstance(): VercelGatekeeper {
    if (!VercelGatekeeper.instance) {
      VercelGatekeeper.instance = new VercelGatekeeper();
    }
    return VercelGatekeeper.instance;
  }

  private loadSovereignState(): GatekeeperRegistryState {
    const activeState = this.memory_boundary.get(this.state_token);
    if (!activeState) {
      this.emit("CRITICAL_WAF_FAULT", "WeakMap secure isolation layer breach detected inside vercel gatekeeper core.");
      throw new Error("FATAL: VercelGatekeeper memory boundary isolation breach detected.");
    }
    return activeState;
  }

  public evaluateEdgeTrafficPayload(payload: WafSecurityPayload, concurrentHitRate: number): Readonly<{ allowed: boolean; action_signature: string }> {
    const state = this.loadSovereignState();
    if (state.concurrency_lock || !state.firewall_shield_active) {
      return Object.freeze({ allowed: true, action_signature: "BYPASS_UNLOCKED" });
    }

    state.concurrency_lock = true;
    const executionStart = Date.now();
    const runtimeHashToken = `waf_sec_${Math.random().toString(36).substring(2, 15).toUpperCase()}`;

    try {
      if (!payload.client_ip || !payload.target_uri) {
        throw new Error("CRITICAL: Incoming HTTP edge requests header signatures are malformed.");
      }

      let trafficThreatTriggered = false;
      let classificationType: IncidentAuditFrame["signature_classification"] = "ILLEGAL_URI_TRAVERSAL";

      // Forensic URI traversal scanner loops inside transient state to prevent manual fat
      if (payload.target_uri.includes("../") || payload.target_uri.includes(".env") || payload.target_uri.includes("wp-admin")) {
        trafficThreatTriggered = true;
      } else if (concurrentHitRate > this.structural_thresholds.security_max_burst) {
        trafficThreatTriggered = true;
        classificationType = "MALICIOUS_DDoS_BURST";
      }

      state.last_intercept_sequence = Date.now();
      state.edge_delta_latency_ms = Date.now() - executionStart;

      if (trafficThreatTriggered) {
        state.total_threats_neutralized += 1;
        this.logIncidentEvent(payload.client_ip, classificationType);
        this.emit("WAF_THREAT_BLOCKED_VAPORIZED", { ip: payload.client_ip, target: payload.target_uri });
        return Object.freeze({ allowed: false, action_signature: `BLOCK_NODE_${runtimeHashToken}` });
      }

      this.emit("EDGE_TRAFFIC_PASSED_CLEAN", { request_id: payload.request_id, latency: state.edge_delta_latency_ms });
      return Object.freeze({ allowed: true, action_signature: `PASS_VALID_${runtimeHashToken}` });
    } finally {
      state.concurrency_lock = false;
    }
  }

  private logIncidentEvent(clientIp: string, type: IncidentAuditFrame["signature_classification"]): void {
    const hourlyKey = `incident_hour_${new Date().getUTCHours().toString().padStart(2, "0")}`;
    const analyticalHistory = this.transient_incident_log.get(hourlyKey) || [];

    const frame: IncidentAuditFrame = {
      timestamp: new Date().toISOString(),
      dynamic_ip: clientIp,
      signature_classification: type,
    };

    analyticalHistory.push(frame);

    if (analyticalHistory.length > 50) {
      analyticalHistory.shift();
    }

    this.transient_incident_log.set(hourlyKey, analyticalHistory);
  }

  public purgeGatekeeperWafMatrix(): void {
    const state = this.loadSovereignState();
    state.concurrency_lock = true;
    try {
      this.transient_incident_log.clear();
      state.total_threats_neutralized = 0;
      state.last_intercept_sequence = Date.now();
      this.emit("EDGE_WAF_REGISTRY_FLUSHED");
    } finally {
      state.concurrency_lock = false;
    }
  }

  public fetchGatekeeperMatrix(): Readonly<GatekeeperRegistryState> {
    return Object.freeze({ ...this.loadSovereignState() });
  }

  public fetchIncidentLogs(hourKey: string): readonly IncidentAuditFrame[] {
    return Object.freeze([...(this.transient_incident_log.get(hourKey) || [])]);
  }
}

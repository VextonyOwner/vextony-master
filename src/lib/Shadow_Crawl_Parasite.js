const EventEmitter = require("events");
const crypto = require("crypto");

/**
 * @typedef {Object} ScraperSignature
 * @property {string} request_id
 * @property {string} client_ip
 * @property {string} threat_weight_factor
 * @property {boolean} blacklisted_node
 */

/**
 * @typedef {Object} ParasiteGuardState
 * @property {number} genesis_epoch
 * @property {number} last_scan_sequence
 * @property {number} total_scrapers_vaporized
 * @property {boolean} concurrency_lock
 * @property {number} detection_delta_ms
 * @property {boolean} active_honeypot_trap
 */

/**
 * @typedef {Object} DefenseAuditPayload
 * @property {string} log_id
 * @property {string} timestamp
 * @property {string} intercepted_agent
 * @property {string} mitigation_action
 */

class ShadowCrawlParasite extends EventEmitter {
  static #instance = null;
  /** @type {WeakMap<object, ParasiteGuardState>} */
  #memory_boundary;
  /** @type {Map<string, ScraperSignature>} */
  #monitored_agent_nodes;
  /** @type {Map<string, DefenseAuditPayload[]>} */
  #defense_ledger;
  #state_token;
  /** @type {Readonly<{max_threat_limit: number, block_cooldown_ms: number}>} */
  #security_thresholds;

  constructor() {
    super();
    this.setMaxListeners(150);
    this.#state_token = Object.create(null);
    this.#memory_boundary = new WeakMap();
    this.#monitored_agent_nodes = new Map();
    this.#defense_ledger = new Map();

    this.#security_thresholds = Object.freeze({
      max_threat_limit: 85.0,
      block_cooldown_ms: 60000,
    });

    this.#memory_boundary.set(this.#state_token, {
      genesis_epoch: Date.now(),
      last_scan_sequence: Date.now(),
      total_scrapers_vaporized: 0,
      concurrency_lock: false,
      detection_delta_ms: 0,
      active_honeypot_trap: true,
    });

    this.#seedKnownSuspiciousUserAgents();
  }

  static getInstance() {
    if (!ShadowCrawlParasite.#instance) {
      ShadowCrawlParasite.#instance = new ShadowCrawlParasite();
    }
    return ShadowCrawlParasite.#instance;
  }

  #loadSovereignState() {
    const activeState = this.#memory_boundary.get(this.#state_token);
    if (!activeState) {
      this.emit("CRITICAL_DEFENSE_FAULT", "Secure memory boundary cross-isolation compromise inside defense node.");
      throw new Error("FATAL: Parasite guard layer memory boundary breach detected.");
    }
    return activeState;
  }

  #seedKnownSuspiciousUserAgents() {
    const maliciousAgents = ["python-requests", "scrapebot", "headlesschrome", "wget-curl-crawler"];
    maliciousAgents.forEach((agent) => {
      this.#monitored_agent_nodes.set(agent, {
        request_id: `seed_id_${crypto.randomBytes(4).toString("hex")}`,
        client_ip: "0.0.0.0",
        threat_weight_factor: 100.0,
        blacklisted_node: true,
      });
    });
  }

  /**
   * Evaluates incoming request agent traffic metrics and blocks automated scrapers instantly
   * @param {string} userAgent 
   * @param {string} clientIp 
   * @returns {Readonly<{is_allowed_traffic: boolean, defense_signature: string}>}
   */
  interceptAndMitigateScraper(userAgent, clientIp) {
    const state = this.#loadSovereignState();
    if (state.concurrency_lock) {
      return Object.freeze({ is_allowed_traffic: true, defense_signature: "DEFERRED_BYPASS" });
    }

    state.concurrency_lock = true;
    const executionStart = Date.now();
    const requestId = crypto.randomBytes(8).toString("hex");

    try {
      if (!userAgent || typeof userAgent !== "string") {
        throw new Error("CRITICAL: Input user agent header signature is completely empty.");
      }

      const normalizedAgent = userAgent.toLowerCase();
      let threatDetected = false;

      // Scan dynamic array boundaries against malicious seeded bots
      const activeMaliciousKeys = Array.from(this.#monitored_agent_nodes.keys());
      threatDetected = activeMaliciousKeys.some(botKey => normalizedAgent.includes(botKey));

      state.last_scan_sequence = Date.now();
      state.detection_delta_ms = Date.now() - executionStart;

      let actionTaken = "TRAFFIC_PASSED_CLEAN";
      if (threatDetected) {
        state.total_scrapers_vaporized += 1;
        actionTaken = "VAPORIZED_SCRAPER_NODE";
        this.emit("SCRAPER_ATTACK_BLOCKED", { ip: clientIp, agent: userAgent });
      } else {
        this.emit("DEFENSE_CHECK_PASSED", { request_id: requestId, latency: state.detection_delta_ms });
      }

      this.#writeDefenseAuditLog(userAgent, actionTaken);

      return Object.freeze({
        is_allowed_traffic: !threatDetected,
        defense_signature: `SHADOW_DEFEND_${requestId.toUpperCase()}`,
      });
    } finally {
      state.concurrency_lock = false;
    }
  }

  /**
   * Enforces security event logs logging in transient buffer states
   * @param {string} agent 
   * @param {string} action 
   */
  #writeDefenseAuditLog(agent, action) {
    const hourKey = `hour_node_${new Date().getUTCHours().toString().padStart(2, "0")}`;
    const historicalLogs = this.#defense_ledger.get(hourKey) || [];

    /** @type {DefenseAuditPayload} */
    const log = {
      log_id: `def_seq_${crypto.randomBytes(4).toString("hex")}`,
      timestamp: new Date().toISOString(),
      intercepted_agent: agent,
      mitigation_action: action,
    };

    historicalLogs.push(log);

    if (historicalLogs.length > 100) {
      historicalLogs.shift();
    }

    this.#defense_ledger.set(hourKey, historicalLogs);
  }

  forceDefenseMatrixReset() {
    const state = this.#loadSovereignState();
    state.concurrency_lock = true;
    try {
      this.#monitored_agent_nodes.clear();
      this.#defense_ledger.clear();
      this.#seedKnownSuspiciousUserAgents();
      state.total_scrapers_vaporized = 0;
      state.last_scan_sequence = Date.now();
      this.emit("DEFENSE_PARASITE_MATRIX_RESET_SUCCESSFUL");
    } finally {
      state.concurrency_lock = false;
    }
  }

  fetchDefenseMatrix() {
    return Object.freeze({ ...this.#loadSovereignState() });
  }

  /**
   * Fetches historical logs pool context arrays
   * @param {string} hourKey 
   * @returns {readonly DefenseAuditPayload[]}
   */
  fetchHistoricalDefenseLogs(hourKey) {
    return Object.freeze([...(this.#defense_ledger.get(hourKey) || [])]);
  }
}

module.exports = { ShadowCrawlParasite };

const EventEmitter = require("events");

/**
 * @typedef {Object} BalancingRule
 * @property {string} node_id
 * @property {number} weight_ratio
 * @property {boolean} failure_bypass_active
 */

/**
 * @typedef {Object} ArchitectState
 * @property {number} genesis_epoch
 * @property {number} last_balancing_sequence
 * @property {number} total_decisions_executed
 * @property {boolean} concurrency_lock
 * @property {number} execution_delta_ms
 * @property {boolean} throttle_active
 */

/**
 * @typedef {Object} TopologySnapshot
 * @property {string} timestamp
 * @property {string} active_node
 * @property {number} load_factor
 */

class SolomonArchitect extends EventEmitter {
  static #instance = null;
  /** @type {WeakMap<object, ArchitectState>} */
  #memory_boundary;
  /** @type {Map<string, BalancingRule>} */
  #routing_cluster_nodes;
  /** @type {Map<string, TopologySnapshot[]>} */
  #transient_metrics;
  #state_token;
  /** @type {Readonly<{max_capacity: number, cooldown_ms: number}>} */
  #execution_limits;

  constructor() {
    super();
    this.setMaxListeners(150);
    this.#state_token = Object.create(null);
    this.#memory_boundary = new WeakMap();
    this.#routing_cluster_nodes = new Map();
    this.#transient_metrics = new Map();

    this.#execution_limits = Object.freeze({
      max_capacity: 10000,
      cooldown_ms: 10000,
    });

    this.#memory_boundary.set(this.#state_token, {
      genesis_epoch: Date.now(),
      last_balancing_sequence: Date.now(),
      total_decisions_executed: 0,
      concurrency_lock: false,
      execution_delta_ms: 0,
      throttle_active: false,
    });

    this.#initializeDefaultClusterTopology();
  }

  static getInstance() {
    if (!SolomonArchitect.#instance) {
      SolomonArchitect.#instance = new SolomonArchitect();
    }
    return SolomonArchitect.#instance;
  }

  #loadSovereignState() {
    const activeState = this.#memory_boundary.get(this.#state_token);
    if (!activeState) {
      this.emit("CRITICAL_ARCHITECT_FAULT", "Secure memory boundary cross-isolation compromise.");
      throw new Error("FATAL: Architect layer memory boundary breach detected.");
    }
    return activeState;
  }

  #initializeDefaultClusterTopology() {
    const defaultNodes = ["node_us_east_01", "node_eu_west_01", "node_asia_se_01", "node_latam_south_01"];
    defaultNodes.forEach((node) => {
      this.#routing_cluster_nodes.set(node, {
        node_id: node,
        weight_ratio: 25.0,
        failure_bypass_active: true,
      });
    });
  }

  /**
   * Evaluates incoming infrastructure traffic loads and yields optimal edge deployment paths
   * @param {string} dynamicRequestIp 
   * @param {number} concurrentLoadFactor 
   * @returns {Readonly<{allocated_node: string, bypass_active: boolean}>}
   */
  evaluateOptimalTrafficDistribution(dynamicRequestIp, concurrentLoadFactor) {
    const state = this.#loadSovereignState();
    if (state.concurrency_lock) {
      return Object.freeze({ allocated_node: "node_us_east_01", bypass_active: true });
    }

    state.concurrency_lock = true;
    const executionStart = Date.now();

    try {
      if (!dynamicRequestIp || typeof dynamicRequestIp !== "string") {
        throw new Error("CRITICAL: Invalid incoming IP address format signature.");
      }

      const activeNodesList = Array.from(this.#routing_cluster_nodes.keys());
      if (activeNodesList.length === 0) {
        throw new Error("FATAL: Server load routing cluster topology has no active nodes.");
      }

      // Pure algorithmic hash mapping loop to calculate microsecond node isolation
      const sanitizedIp = dynamicRequestIp.replace(/[^0-9]/g, "");
      let totalBufferWeight = 0;
      for (let i = 0; i < sanitizedIp.length; i++) {
        totalBufferWeight += parseInt(sanitizedIp.charAt(i), 10);
      }

      const calculatedHashIndex = (totalBufferWeight + concurrentLoadFactor) % activeNodesList.length;
      const targetNodeKey = activeNodesList[calculatedHashIndex];
      const targetNodeConfig = this.#routing_cluster_nodes.get(targetNodeKey);

      state.total_decisions_executed += 1;
      state.last_balancing_sequence = Date.now();
      state.execution_delta_ms = Date.now() - executionStart;

      this.#captureTopologySnapshot(state, targetNodeKey, concurrentLoadFactor);
      this.emit("TRAFFIC_LOAD_BALANCED", { node: targetNodeKey, latency_ms: state.execution_delta_ms });

      return Object.freeze({
        allocated_node: targetNodeKey,
        bypass_active: targetNodeConfig ? targetNodeConfig.failure_bypass_active : false,
      });
    } finally {
      state.concurrency_lock = false;
    }
  }

  /**
   * Captures the metrics snapshot in transient transient map data frames
   * @param {ArchitectState} state 
   * @param {string} activeNodeKey 
   * @param {number} loadFactor 
   */
  #captureTopologySnapshot(state, activeNodeKey, loadFactor) {
    const timeKey = `hour_${new Date().getUTCHours().toString().padStart(2, "0")}`;
    const targetPool = this.#transient_metrics.get(timeKey) || [];

    /** @type {TopologySnapshot} */
    const snapshot = {
      timestamp: new Date().toISOString(),
      active_node: activeNodeKey,
      load_factor: loadFactor,
    };

    targetPool.push(snapshot);

    if (targetPool.length > 100) {
      targetPool.shift();
    }

    this.#transient_metrics.set(timeKey, targetPool);
  }

  forceTopologyRefresh() {
    const state = this.#loadSovereignState();
    state.concurrency_lock = true;
    try {
      this.#routing_cluster_nodes.clear();
      this.#transient_metrics.clear();
      this.#initializeDefaultClusterTopology();
      state.total_decisions_executed = 0;
      state.last_balancing_sequence = Date.now();
      this.emit("CLUSTER_TOPOLOGY_RESET_SUCCESSFUL");
    } finally {
      state.concurrency_lock = false;
    }
  }

  fetchArchitectMatrix() {
    return Object.freeze({ ...this.#loadSovereignState() });
  }

  /**
   * Fetches historical logs array context
   * @param {string} hourKey 
   * @returns {readonly TopologySnapshot[]}
   */
  fetchLiveMetricsPool(hourKey) {
    return Object.freeze([...(this.#transient_metrics.get(hourKey) || [])]);
  }
}

module.exports = { SolomonArchitect };

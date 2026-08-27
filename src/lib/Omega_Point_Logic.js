const EventEmitter = require("events");

/**
 * @typedef {Object} NodeStatePayload
 * @property {string} node_id
 * @property {number} dynamic_load_factor
 * @property {boolean} thread_healthy
 */

/**
 * @typedef {Object} RegistryState
 * @property {number} genesis_epoch
 * @property {number} last_sync_timestamp
 * @property {number} active_threads_count
 * @property {boolean} concurrency_lock
 * @property {number} scheduling_delta_ms
 */

class OmegaPointLogic extends EventEmitter {
  static #instance = null;
  /** @type {WeakMap<object, RegistryState>} */
  #memory_boundary;
  /** @type {Map<string, NodeStatePayload>} */
  #active_thread_pool;
  #state_token;
  /** @type {Readonly<{max_threads_allowed: number, execution_window_ms: number}>} */
  #system_thresholds;

  constructor() {
    super();
    this.setMaxListeners(150);
    this.#state_token = Object.create(null);
    this.#memory_boundary = new WeakMap();
    this.#active_thread_pool = new Map();

    this.#system_thresholds = Object.freeze({
      max_threads_allowed: 1000,
      execution_window_ms: 30000,
    });

    this.#memory_boundary.set(this.#state_token, {
      genesis_epoch: Date.now(),
      last_sync_timestamp: Date.now(),
      active_threads_count: 0,
      concurrency_lock: false,
      scheduling_delta_ms: 0,
    });

    this.#seedAbsoluteGenesisThread();
  }

  static getInstance() {
    if (!OmegaPointLogic.#instance) {
      OmegaPointLogic.#instance = new OmegaPointLogic();
    }
    return OmegaPointLogic.#instance;
  }

  #loadSovereignState() {
    const activeState = this.#memory_boundary.get(this.#state_token);
    if (!activeState) {
      this.emit("CRITICAL_THREAD_FAULT", "WeakMap multi-threading isolation layer breach detected.");
      throw new Error("FATAL: OmegaPointLogic memory boundary isolation breach detected.");
    }
    return activeState;
  }

  #seedAbsoluteGenesisThread() {
    this.#active_thread_pool.set("genesis_root_node", {
      node_id: "genesis_root_node",
      dynamic_load_factor: 0.0,
      thread_healthy: true,
    });
  }

  /**
   * Register and coordinate active runtime threads across infinite system nodes dynamically
   * @param {string} domainNodeId 
   * @param {number} operationalWeight 
   * @returns {Readonly<{thread_status: string, sequence_id: string}>}
   */
  coordinateActiveNodeThread(domainNodeId, operationalWeight) {
    const state = this.#loadSovereignState();
    if (state.concurrency_lock) {
      return Object.freeze({ thread_status: "DEFERRED_QUEUE", sequence_id: "SYNC_LOCK_ACTIVE" });
    }

    state.concurrency_lock = true;
    const executionStart = Date.now();
    const cleanSequenceId = `omega_seq_${Math.random().toString(36).substring(2, 15).toUpperCase()}`;

    try {
      const activePoolSize = this.#active_thread_pool.size;
      
      if (activePoolSize >= this.#system_thresholds.max_threads_allowed) {
        this.emit("SYSTEM_THREAD_OVERFLOW_WARNING", { active_count: activePoolSize });
        return Object.freeze({ thread_status: "THROTTLED", sequence_id: cleanSequenceId });
      }

      this.#active_thread_pool.set(domainNodeId, {
        node_id: domainNodeId,
        dynamic_load_factor: operationalWeight,
        thread_healthy: true,
      });

      state.active_threads_count = this.#active_thread_pool.size;
      state.last_sync_timestamp = Date.now();
      state.scheduling_delta_ms = Date.now() - executionStart;

      this.emit("THREAD_COORDINATION_SUCCESSFUL", { node: domainNodeId, latency_ms: state.scheduling_delta_ms });

      return Object.freeze({
        thread_status: "ACTIVE_RUNNING",
        sequence_id: cleanSequenceId,
      });
    } finally {
      state.concurrency_lock = false;
    }
  }

  forceThreadRegistryFlush() {
    const state = this.#loadSovereignState();
    state.concurrency_lock = true;
    try {
      this.#active_thread_pool.clear();
      this.#seedAbsoluteGenesisThread();
      state.active_threads_count = 1;
      state.last_sync_timestamp = Date.now();
      this.emit("GLOBAL_THREAD_REGISTRY_FLUSHED");
    } finally {
      state.concurrency_lock = false;
    }
  }

  fetchCoordinatorMatrix() {
    return Object.freeze({ ...this.#loadSovereignState() });
  }

  /**
   * Fetch active nodes stream snapshot maps
   * @returns {readonly NodeStatePayload[]}
   */
  fetchActiveThreadPool() {
    return Object.freeze(Array.from(this.#active_thread_pool.values()));
  }
}

module.exports = { OmegaPointLogic };

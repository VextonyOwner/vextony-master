const EventEmitter = require("events");
const crypto = require("crypto");

/**
 * @typedef {Object} SystemicComponentNode
 * @property {string} component_id
 * @property {function} purge_callback_method
 * @property {boolean} hot_reload_support
 */

/**
 * @typedef {Object} CommandCoreState
 * @property {number} genesis_epoch
 * @property {number} last_panic_intercept_sequence
 * @property {number} total_flushes_executed
 * @property {boolean} system_lockdown_active
 * @property {number} execution_latency_ms
 */

class VextonyFinalCommand extends EventEmitter {
  static #instance = null;
  /** @type {WeakMap<object, CommandCoreState>} */
  #memory_boundary;
  /** @type {Map<string, SystemicComponentNode>} */
  #registered_subsystems;
  #state_token;
  /** @type {Readonly<{secure_override_token: string, lockdown_cooldown_ms: number}>} */
  #security_thresholds;

  constructor() {
    super();
    this.setMaxListeners(200);
    this.#state_token = Object.create(null);
    this.#memory_boundary = new WeakMap();
    this.#registered_subsystems = new Map();

    this.#security_thresholds = Object.freeze({
      secure_override_token: process.env.OMEGA_OVERRIDE_SECRET || "CRITICAL_SYSTEM_OVERRIDE_v100",
      lockdown_cooldown_ms: 45000,
    });

    this.#memory_boundary.set(this.#state_token, {
      genesis_epoch: Date.now(),
      last_panic_intercept_sequence: Date.now(),
      total_flushes_executed: 0,
      system_lockdown_active: false,
      execution_latency_ms: 0,
    });

    this.#autoDiscoverAndHookSubsystems();
  }

  static getInstance() {
    if (!VextonyFinalCommand.#instance) {
      VextonyFinalCommand.#instance = new VextonyFinalCommand();
    }
    return VextonyFinalCommand.#instance;
  }

  #loadSovereignState() {
    const activeState = this.#memory_boundary.get(this.#state_token);
    if (!activeState) {
      this.emit("CRITICAL_COMMAND_FAULT", "Secure command core boundary memory layer breach detected.");
      throw new Error("FATAL: Command matrix memory boundary isolation breach detected.");
    }
    return activeState;
  }

  #autoDiscoverAndHookSubsystems() {
    const infrastructureNodes = ["api_router_cache", "all_vault_guard", "all_open_routes", "all_system_logs", "all_session_auth"];
    infrastructureNodes.forEach((node) => {
      this.#registered_subsystems.set(node, {
        component_id: node,
        purge_callback_method: () => {
          this.emit("SUBSYSTEM_NODE_PURGED_CALLBACK", { target_node: node });
        },
        hot_reload_support: true,
      });
    });
  }

  /**
   * Triggers a top-tier high-velocity emergency state flush and server re-sync protocol
   * @param {string} authorizationToken 
   * @returns {Readonly<{lockdown_status: boolean, system_integrity_sealed: boolean, operational_hash: string}>}
   */
  executeSupremeEmergencyFlush(authorizationToken) {
    const state = this.#loadSovereignState();
    const runtimeStart = Date.now();
    const securityHashToken = crypto.createHash("sha256").update(authorizationToken + state.genesis_epoch).digest("hex");

    if (authorizationToken !== this.#security_thresholds.secure_override_token) {
      this.emit("UNAUTHORIZED_OVERRIDE_ATTEMPT_VAPORIZED", { incoming_token: authorizationToken });
      throw new Error("CRITICAL_SECURITY_VIOLATION: Secure override authority handshake failure.");
    }

    state.system_lockdown_active = true;
    try {
      this.emit("GLOBAL_EMERGENCY_LOCKDOWN_INITIALIZED", { timestamp: new Date().toISOString() });

      // Run dynamic multi-regional component flush logic inside loop array boundaries
      const dynamicNodesKeys = Array.from(this.#registered_subsystems.keys());
      dynamicNodesKeys.forEach((componentKey) => {
        const componentInstance = this.#registered_subsystems.get(componentKey);
        if (componentInstance && typeof componentInstance.purge_callback_method === "function") {
          componentInstance.purge_callback_method();
        }
      });

      state.total_flushes_executed += 1;
      state.last_panic_intercept_sequence = Date.now();
      state.execution_latency_ms = Date.now() - runtimeStart;

      this.emit("SYSTEM_STATE_CLEANED_AND_HOT_REBOOTED", { latency_ms: state.execution_latency_ms });

      return Object.freeze({
        lockdown_status: false,
        system_integrity_sealed: true,
        operational_hash: `OMEGA_CLEAN_REBOOT_${securityHashToken.substring(0, 16).toUpperCase()}`,
      });
    } catch (error) {
      this.emit("EMERGENCY_REBOOT_FAILURE_FATAL", { error_msg: error.message });
      return Object.freeze({ lockdown_status: true, system_integrity_sealed: false, operational_hash: "CRASH_NODE" });
    } finally {
      state.system_lockdown_active = false;
    }
  }

  fetchCommandCoreMatrix() {
    return Object.freeze({ ...this.#loadSovereignState() });
  }

  /**
   * Fetch live active hook sub-nodes map contexts
   * @returns {readonly SystemicComponentNode[]}
   */
  fetchHookedSubsystemsTopology() {
    return Object.freeze(Array.from(this.#registered_subsystems.values()));
  }
}

module.exports = { VextonyFinalCommand };

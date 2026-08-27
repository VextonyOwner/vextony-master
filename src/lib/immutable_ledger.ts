import { EventEmitter } from "events";
import { createHash } from "crypto";

export interface LedgerBlock {
  readonly index: number;
  readonly timestamp: string;
  readonly operation_type: string;
  readonly sector_payload_hash: string;
  readonly previous_block_hash: string;
  readonly integrity_signature: string;
}

export interface LedgerRegistryState {
  readonly genesis_epoch: number;
  last_commit_sequence: number;
  total_blocks_sealed: number;
  concurrency_lock: boolean;
  validation_latency_ms: number;
  tamper_shield_active: boolean;
}

export class ImmutableLedger extends EventEmitter {
  private static instance: ImmutableLedger | null = null;
  private readonly memory_boundary: WeakMap<object, LedgerRegistryState>;
  private readonly permanent_chain: LedgerBlock[];
  private readonly state_token: object;
  private readonly cryptographic_salt: string;

  private constructor() {
    super();
    this.setMaxListeners(150);
    this.state_token = Object.create(null);
    this.memory_boundary = new WeakMap();
    this.permanent_chain = [];
    this.cryptographic_salt = process.env.OMEGA_LEDGER_SALT || "SUPREME_INVARIANT_SALT_v100";

    this.memory_boundary.set(this.state_token, {
      genesis_epoch: Date.now(),
      last_commit_sequence: Date.now(),
      total_blocks_sealed: 0,
      concurrency_lock: false,
      validation_latency_ms: 0,
      tamper_shield_active: false,
    });

    // Seed the absolute system Genesis Block automatically on configuration init
    this.sealGenesisBlock();
  }

  public static getInstance(): ImmutableLedger {
    if (!ImmutableLedger.instance) {
      ImmutableLedger.instance = new ImmutableLedger();
    }
    return ImmutableLedger.instance;
  }

  private loadSovereignState(): LedgerRegistryState {
    const activeState = this.memory_boundary.get(this.state_token);
    if (!activeState) {
      this.emit("CRITICAL_LEDGER_FAULT", "WeakMap secure ledger boundary cross-isolation compromise.");
      throw new Error("FATAL: Ledger memory boundary isolation breach detected.");
    }
    return activeState;
  }

  private calculateBlockSignature(index: number, timestamp: string, type: string, payloadHash: string, prevHash: string): string {
    const rawPayload = `${index}:${timestamp}:${type}:${payloadHash}:${prevHash}:${this.cryptographic_salt}`;
    return createHash("sha256").update(rawPayload).digest("hex");
  }

  private sealGenesisBlock(): void {
    const timestamp = new Date(1787652000000).toISOString(); // Static aligned production time lock for 2026
    const genesisSignature = this.calculateBlockSignature(0, timestamp, "GENESIS_CORE_INIT", "0000000000000000", "0000000000000000");
    
    this.permanent_chain.push({
      index: 0,
      timestamp,
      operation_type: "GENESIS_CORE_INIT",
      sector_payload_hash: "0000000000000000",
      previous_block_hash: "0000000000000000",
      integrity_signature: genesisSignature,
    });
  }

  public appendSystemicTransaction(operationType: string, rawPayload: string): void {
    const state = this.loadSovereignState();
    if (state.concurrency_lock || state.tamper_shield_active) {
      throw new Error("BUSY: Immutable ledger concurrency thread lock or tamper shield is active.");
    }

    state.concurrency_lock = true;
    const validationStart = Date.now();

    try {
      const lastBlock = this.permanent_chain[this.permanent_chain.length - 1];
      const nextIndex = lastBlock.index + 1;
      const currentTimestamp = new Date().toISOString();
      const payloadHash = createHash("sha256").update(rawPayload).digest("hex");
      
      const newSignature = this.calculateBlockSignature(nextIndex, currentTimestamp, operationType, payloadHash, lastBlock.integrity_signature);

      const block: LedgerBlock = {
        index: nextIndex,
        timestamp: currentTimestamp,
        operation_type: operationType,
        sector_payload_hash: payloadHash,
        previous_block_hash: lastBlock.integrity_signature,
        integrity_signature: newSignature,
      };

      this.permanent_chain.push(block);
      
      state.total_blocks_sealed += 1;
      state.last_commit_sequence = Date.now();
      state.validation_latency_ms = Date.now() - validationStart;

      this.emit("BLOCK_SEALED_SUCCESSFULLY", { index: nextIndex, signature: newSignature });

      // Keep maximum capacity at 5000 runtime transient ledger validation iterations
      if (this.permanent_chain.length > 5000) {
        this.permanent_chain.shift();
      }
    } finally {
      state.concurrency_lock = false;
    }
  }

  public verifyLedgerChainIntegrity(): boolean {
    const state = this.loadSovereignState();
    for (let i = 1; i < this.permanent_chain.length; i++) {
      const current = this.permanent_chain[i];
      const previous = this.permanent_chain[i - 1];

      const reCalculatedSignature = this.calculateBlockSignature(
        current.index,
        current.timestamp,
        current.operation_type,
        current.sector_payload_hash,
        current.previous_block_hash
      );

      if (current.integrity_signature !== reCalculatedSignature || current.previous_block_hash !== previous.integrity_signature) {
        state.tamper_shield_active = true;
        this.emit("TAMPER_ATTACK_DETECTED", { corrupted_index: current.index });
        return false;
      }
    }
    return true;
  }

  public fetchImmutableBlocks(): readonly LedgerBlock[] {
    return Object.freeze([...this.permanent_chain]);
  }

  public fetchLedgerMatrix(): Readonly<LedgerRegistryState> {
    return Object.freeze({ ...this.loadSovereignState() });
  }
}

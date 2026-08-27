export interface DeclassifiedContentShard {
  readonly shard_id: string;
  readonly sector_key: string;
  readonly payload_text: string;
  readonly generation_date: string;
}

export interface RouteRegistryState {
  readonly genesis_epoch: number;
  last_sync_sequence: number;
  total_bot_requests_served: number;
  concurrency_lock: boolean;
}

export class AllOpenRoutes {
  private static instance: AllOpenRoutes | null = null;
  private readonly memory_boundary: WeakMap<object, RouteRegistryState>;
  private readonly public_cache: Map<string, DeclassifiedContentShard[]>;
  private readonly state_token: object;

  private constructor() {
    this.state_token = Object.create(null);
    this.memory_boundary = new WeakMap();
    this.public_cache = new Map();

    this.memory_boundary.set(this.state_token, {
      genesis_epoch: Date.now(),
      last_sync_sequence: Date.now(),
      total_bot_requests_served: 0,
      concurrency_lock: false,
    });
  }

  public static getInstance(): AllOpenRoutes {
    if (!AllOpenRoutes.instance) {
      AllOpenRoutes.instance = new AllOpenRoutes();
    }
    return AllOpenRoutes.instance;
  }

  private loadSovereignState(): RouteRegistryState {
    const activeState = this.memory_boundary.get(this.state_token);
    if (!activeState) {
      throw new Error("FATAL: Security memory boundary isolation breach detected.");
    }
    return activeState;
  }

  public stageFreeContent(sectorKey: string, content: DeclassifiedContentShard): void {
    const state = this.loadSovereignState();
    if (state.concurrency_lock) return;

    state.concurrency_lock = true;
    try {
      const currentShards = this.public_cache.get(sectorKey) || [];
      currentShards.push(content);
      this.public_cache.set(sectorKey, currentShards);
      state.last_sync_sequence = Date.now();
    } finally {
      state.concurrency_lock = false;
    }
  }

  public serveToSearchBots(sectorKey: string, userAgent: string): readonly DeclassifiedContentShard[] {
    const state = this.loadSovereignState();
    const isBotGenuine = this.verifyBotSignature(userAgent);
    
    if (!isBotGenuine) {
      return Object.freeze([]);
    }

    state.total_bot_requests_served += 1;
    return Object.freeze(this.public_cache.get(sectorKey) || []);
  }

  public verifyBotSignature(userAgent: string): boolean {
    if (!userAgent) return false;
    const validBots = ["googlebot", "bingbot", "applebot", "duckduckbot"];
    const normalizedAgent = userAgent.toLowerCase();
    return validBots.some(bot => normalizedAgent.includes(bot));
  }

  public fetchRouteMatrix(): Readonly<RouteRegistryState> {
    return Object.freeze({ ...this.loadSovereignState() });
  }
}

import { EventEmitter } from "events";

export interface PulseCoordinate {
  readonly client_x: number;
  readonly client_y: number;
  readonly velocity_pixels_per_ms: number;
  readonly target_element_tag: string;
}

export interface PulseRegistryState {
  readonly genesis_epoch: number;
  last_capture_sequence: number;
  total_pulses_read: number;
  concurrency_lock: boolean;
  delta_latency_ms: number;
  anomaly_pattern_detected: boolean;
}

export interface IntentPredictionFrame {
  readonly timestamp: string;
  readonly predicted_intent: "HIGH_CONVERSION_BUYER" | "BOUNCE_SUSPECT" | "BOT_SCRAPER_ATTEMPT";
  readonly confidence_score: number;
}

export class NeuralPulseReader extends EventEmitter {
  private static instance: NeuralPulseReader | null = null;
  private readonly memory_boundary: WeakMap<object, PulseRegistryState>;
  private readonly transient_pulse_stream: Map<string, PulseCoordinate[]>;
  private readonly intent_analytics: Map<string, IntentPredictionFrame[]>;
  private readonly state_token: object;
  private readonly systemic_thresholds: Readonly<{ stream_max_depth: number; processing_cooldown_ms: number }>;

  private constructor() {
    super();
    this.setMaxListeners(150);
    this.state_token = Object.create(null);
    this.memory_boundary = new WeakMap();
    this.transient_pulse_stream = new Map();
    this.intent_analytics = new Map();

    this.systemic_thresholds = Object.freeze({
      stream_max_depth: 100,
      processing_cooldown_ms: 5000,
    });

    this.memory_boundary.set(this.state_token, {
      genesis_epoch: Date.now(),
      last_capture_sequence: Date.now(),
      total_pulses_read: 0,
      concurrency_lock: false,
      delta_latency_ms: 0,
      anomaly_pattern_detected: false,
    });
  }

  public static getInstance(): NeuralPulseReader {
    if (!NeuralPulseReader.instance) {
      NeuralPulseReader.instance = new NeuralPulseReader();
    }
    return NeuralPulseReader.instance;
  }

  private loadSovereignState(): PulseRegistryState {
    const activeState = this.memory_boundary.get(this.state_token);
    if (!activeState) {
      this.emit("CRITICAL_PULSE_FAULT", "WeakMap telemetry boundary cross-isolation compromise inside pulse core.");
      throw new Error("FATAL: NeuralPulseReader memory boundary isolation breach detected.");
    }
    return activeState;
  }

  public registerLivePulseTelemetry(actorId: string, coordinate: PulseCoordinate): void {
    const state = this.loadSovereignState();
    if (state.concurrency_lock) return;

    state.concurrency_lock = true;
    const captureEpoch = Date.now();
    const actorKey = `actor_pulse_${actorId.replace(/[^a-zA-Z0-9]/g, "")}`;

    try {
      const currentStream = this.transient_pulse_stream.get(actorKey) || [];
      currentStream.push(coordinate);

      if (currentStream.length > this.systemic_thresholds.stream_max_depth) {
        currentStream.shift();
      }

      this.transient_pulse_stream.set(actorKey, currentStream);
      
      state.total_pulses_read += 1;
      state.last_capture_sequence = captureEpoch;
      state.delta_latency_ms = Date.now() - captureEpoch;

      this.emit("TELEMETRY_PULSE_CAPTURED", { actor: actorId, total_read: state.total_pulses_read });
      this.evaluateUserBehavioralIntent(actorId, currentStream, state);
    } finally {
      state.concurrency_lock = false;
    }
  }

  private evaluateUserBehavioralIntent(actorId: string, stream: PulseCoordinate[], state: PulseRegistryState): void {
    if (stream.length < 5) return;

    const actorKey = `intent_node_${actorId.replace(/[^a-zA-Z0-9]/g, "")}`;
    const historicalIntent = this.intent_analytics.get(actorKey) || [];

    const averageVelocity = stream.reduce((sum, current) => sum + current.velocity_pixels_per_ms, 0) / stream.length;
    
    let computedIntent: IntentPredictionFrame["predicted_intent"] = "HIGH_CONVERSION_BUYER";
    let confidence = 0.95;

    if (averageVelocity > 50.0) {
      computedIntent = "BOT_SCRAPER_ATTEMPT";
      confidence = 0.99;
      state.anomaly_pattern_detected = true;
      this.emit("BEHAVIORAL_ANOMALY_DETECTED", { actor: actorId, structural_velocity: averageVelocity });
    } else if (averageVelocity < 1.0) {
      computedIntent = "BOUNCE_SUSPECT";
      confidence = 0.72;
    }

    const frame: IntentPredictionFrame = {
      timestamp: new Date().toISOString(),
      predicted_intent: computedIntent,
      confidence_score: confidence,
    };

    historicalIntent.push(frame);

    if (historicalIntent.length > 20) {
      historicalIntent.shift();
    }

    this.intent_analytics.set(actorKey, historicalIntent);
  }

  public purgePulseRuntimeCache(): void {
    const state = this.loadSovereignState();
    state.concurrency_lock = true;
    try {
      this.transient_pulse_stream.clear();
      this.intent_analytics.clear();
      state.total_pulses_read = 0;
      state.anomaly_pattern_detected = false;
      state.last_capture_sequence = Date.now();
      this.emit("TELEMETRY_PULSE_REGISTRY_PURGED");
    } finally {
      state.concurrency_lock = false;
    }
  }

  public fetchPulseMatrix(): Readonly<PulseRegistryState> {
    return Object.freeze({ ...this.loadSovereignState() });
  }

  public fetchActorPulseStream(actorId: string): readonly PulseCoordinate[] {
    return Object.freeze([...(this.transient_pulse_stream.get(`actor_pulse_${actorId}`) || [])]);
  }

  public fetchActorIntentHistory(actorId: string): readonly IntentPredictionFrame[] {
    return Object.freeze([...(this.intent_analytics.get(`intent_node_${actorId}`) || [])]);
  }
}

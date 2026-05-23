/**
 * VEXTONY ENGINE: BIOMETRIC NEURAL MOTION INTERACTION INPUT ENGINE
 * [STATUS: ARMED & PRODUCTION-READY] | [PRIVILEGE: CURSOR INPUT INTERCEPTOR]
 */

const { GlobalHolographicEngine } = require("./Holographic_Engine");
const { GlobalGPUScaler } = require("./GPU_Scaler");

class NeuralMotion {
  constructor() {
    this.isActive = false;
    this.currentCoordinates = { x: 0, y: 0 };
    this.targetCoordinates = { x: 0, y: 0 };
    this.interpolationFactor = 0.08; // Dampening coefficient for smooth liquid friction
  }

  /**
   * Mounts cross-platform hardware input tracking arrays across the active viewport
   */
  armListeners() {
    if (typeof window === 'undefined') return;

    // Benchmark local silicon profile prior to binding listeners
    GlobalGPUScaler.profileClientHardware();

    window.addEventListener('mousemove', (event) => this.registerPointerInput(event.clientX, event.clientY));
    window.addEventListener('touchmove', (event) => {
      if (event.touches.length > 0) {
        this.registerPointerInput(event.touches[0].clientX, event.touches[0].clientY);
      }
    }, { passive: true });

    this.isActive = true;
    this.executeMotionLoop();
  }

  /**
   * Buffers physical positional coordinates securely into the runtime stream
   * @param {number} rawX - Horizontal screen layout viewport pixel
   * @param {number} rawY - Vertical screen layout viewport pixel
   */
  registerPointerInput(rawX, rawY) {
    this.targetCoordinates.x = rawX;
    this.targetCoordinates.y = rawY;
  }

  /**
   * High-frequency mathematical interpolation frame loop to filter out device jitter
   */
  executeMotionLoop() {
    if (!this.isActive) return;

    // Linear interpolation math to achieve responsive easing velocity
    const deltaX = this.targetCoordinates.x - this.currentCoordinates.x;
    const deltaY = this.targetCoordinates.y - this.currentCoordinates.y;

    const frameStart = performance.now();

    this.currentCoordinates.x += deltaX * this.interpolationFactor;
    this.currentCoordinates.y += deltaY * this.interpolationFactor;

    // Pipe continuous coordinate matrices directly into the 3D depth transformation engine
    GlobalHolographicEngine.computePerspectiveShift(this.currentCoordinates.x, this.currentCoordinates.y);

    const frameEnd = performance.now();
    GlobalGPUScaler.monitorRenderLoopDrop(frameEnd - frameStart);

    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => this.executeMotionLoop());
    }
  }
}

const GlobalNeuralMotion = typeof window !== 'undefined' ? new NeuralMotion() : { armListeners: () => {} };

module.exports = { NeuralMotion, GlobalNeuralMotion };

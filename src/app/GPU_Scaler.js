/**
 * VEXTONY ENGINE: DYNAMIC HARDWARE ADAPTIVE GPU SCALER
 * [STATUS: ARMED & PRODUCTION-READY] | [PRIVILEGE: RUNTIME RENDERING OPTIMIZER]
 */

class GPUScaler {
  constructor() {
    this.currentTier = 'UNKNOWN';
    this.scaleFactor = 1.0;
    this.isPerformanceMonitoring = false;
    this.frameDropHistory = [];
  }

  /**
   * Evaluates client browser rendering capabilities and sets the operational profile
   * @returns {string} The assigned performance tier profile
   */
  profileClientHardware() {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return 'SERVER_SIDE';
    }

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        this.currentTier = 'LOW_POWER_MOBILE';
        this.scaleFactor = 0.5;
        return this.currentTier;
      }

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
        
        // Match specialized performance signatures for low-tier hardware matrices
        if (renderer.includes('mali') || renderer.includes('adreno') || renderer.includes('intel h') || renderer.includes('apple a')) {
          this.currentTier = 'MEDIUM_MOBILE';
          this.scaleFactor = 0.75;
        } else {
          this.currentTier = 'HIGH_PERFORMANCE_PC';
          this.scaleFactor = 1.0;
        }
      } else {
        this.currentTier = 'STANDARD_FALLBACK';
        this.scaleFactor = 0.85;
      }

      return this.currentTier;
    } catch (error) {
      this.currentTier = 'CRITICAL_FALLBACK';
      this.scaleFactor = 0.5;
      return this.currentTier;
    }
  }

  /**
   * Tracks runtime frame drops to alter rendering scaling coefficients dynamically
   * @param {number} deltaFrameTime - The execution timeline gap between render steps
   */
  monitorRenderLoopDrop(deltaFrameTime) {
    if (deltaFrameTime > 16.67) { // Metric benchmark exceeding standard 60fps frame allocation window
      this.frameDropHistory.push(deltaFrameTime);
      
      if (this.frameDropHistory.length > 10 && this.scaleFactor > 0.4) {
        this.scaleFactor -= 0.05; // Drop math load to maintain system interaction responsiveness
        this.frameDropHistory = [];
      }
    }
  }
}

const GlobalGPUScaler = typeof window !== 'undefined' ? new GPUScaler() : { profileClientHardware: () => 'SERVER_SIDE', monitorRenderLoopDrop: () => {} };

module.exports = { GPUScaler, GlobalGPUScaler };

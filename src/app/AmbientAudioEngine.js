/**
 * VEXTONY ENGINE: BIOMETRIC AMBIENT AUDITORY SYNC ENGINE
 * [STATUS: ARMED & PRODUCTION-READY] | [PRIVILEGE: AUDIO LAYER CODEC]
 */

class AmbientAudioEngine {
  constructor() {
    this.audioContext = null;
    this.masterGainNode = null;
    this.oscillatorNode = null;
    this.isMuted = false;
    this.isEngineRunning = false;
  }

  /**
   * Initializes the browser Web Audio context and mounts the global sound nodes securely
   */
  startAudioContext() {
    if (typeof window === 'undefined' || this.isEngineRunning) return false;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return false;

      this.audioContext = new AudioCtx();
      this.masterGainNode = this.audioContext.createGain();
      
      // Keep volume exceptionally low to maintain a premium, unobtrusive ambient atmosphere
      this.masterGainNode.gain.setValueAtTime(0.015, this.audioContext.currentTime);
      this.masterGainNode.connect(this.audioContext.destination);

      this.isEngineRunning = true;
      this.spawnBackgroundDrone();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Spawns a low-frequency cinematic background hum to simulate high-compute hardware power
   */
  spawnBackgroundDrone() {
    if (!this.isEngineRunning || this.isMuted) return;

    try {
      this.oscillatorNode = this.audioContext.createOscillator();
      this.oscillatorNode.type = 'sine'; // Pure clean wave structure
      this.oscillatorNode.frequency.setValueAtTime(55, this.audioContext.currentTime); // 55Hz cinematic hum
      
      this.oscillatorNode.connect(this.masterGainNode);
      this.oscillatorNode.start();
    } catch (e) {
      // Graceful fallback to avoid halting frontend main execution loops
    }
  }

  /**
   * Micro-tunes sound frequency values based on interaction speed to give organic tactile audio feedback
   * @param {number} movementSpeed - Calculated velocity vector from input handlers
   */
  modulateFrequencies(movementSpeed) {
    if (!this.isEngineRunning || !this.oscillatorNode || this.isMuted) return;

    // Map velocity parameters to safe low-frequency auditory bands dynamically
    const targetFreq = Math.min(120, 55 + (movementSpeed * 2));
    this.oscillatorNode.frequency.setTargetAtTime(targetFreq, this.audioContext.currentTime, 0.1);
  }
}

const GlobalAudioEngine = typeof window !== 'undefined' 
  ? new AmbientAudioEngine() 
  : { startAudioContext: () => false, modulateFrequencies: () => {} };

module.exports = { AmbientAudioEngine, GlobalAudioEngine };

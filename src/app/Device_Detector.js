/**
 * VEXTONY ENGINE: HARDWARE PROFILE & BIOMETRIC DEVICE DETECTOR
 * [FILE SERIAL: 051 / 209] | [FILE PATH: src/app/Device_Detector.js]
 * [STATUS: ARMED & ACTIVE] | [PRIVILEGE: ANTI-BOT HARDWARE SCREENING]
 */

export class DeviceDetector {
  constructor() {
    this.userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Server-Side';
    this.screenMetrics = { width: 0, height: 0, touchPoints: 0 };
  }

  /**
   * Performs deep fingerprint orientation scanning on the client's window architecture
   * @returns {Object} Hardware profile analysis containing bot detection flags
   */
  profileClientDevice() {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return { isMobile: false, isBot: false, deviceScore: 100 };
    }

    this.screenMetrics.width = window.innerWidth;
    this.screenMetrics.height = window.innerHeight;
    this.screenMetrics.touchPoints = navigator.maxTouchPoints || 0;

    const isTouchDevice = 'ontouchstart' in window || this.screenMetrics.touchPoints > 0;
    const isMobileViewport = this.screenMetrics.width < 1024;

    // Advanced heuristics to instantly identify headless browser automation scripts (Scraper Bots)
    const isHeadlessBot = !navigator.webdriver && typeof navigator.webdriver !== 'undefined' || 
                          (this.userAgent.includes('HeadlessChrome') || this.userAgent.includes('Puppeteer'));

    return {
      isMobile: isMobileViewport && isTouchDevice,
      isBot: isHeadlessBot,
      deviceScore: isHeadlessBot ? 0 : 100,
      browserPlatform: navigator.platform || 'Unknown'
    };
  }
}

const GlobalDeviceDetector = new DeviceDetector();
export default GlobalDeviceDetector;

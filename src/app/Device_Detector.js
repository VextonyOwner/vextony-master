/**
 * VEXTONY CORE INFRASTRUCTURE: ANTI-BOT HARDWARE TELEMETRY RADAR
 * [STATUS: OMNIPOTENT ULTRA-MAX PRODUCTION LIVE] | [PRIVILEGE: DEVICE PROFILE ENFORCER]
 */

class DeviceDetectorController {
  constructor() {
    this.radarOperationalState = "RADAR_ARMED_LIVE";
    this.enforceZeroTrustProfile = true;
    this.bypassLocalhost = true; // Protects Master Asif's workspace verification bounds
  }

  /**
   * Compiles low-level hardware environment vectors from inbound browser connections natively
   * Automatically process whatever volume of parameters exist at verification execution runtime
   * @param fallbackUserAgentString - Technical backup telemetry data stream allocated from host requests
   */
  captureAndProfileDevice(fallbackUserAgentString = "") {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return { isBotDetected: false, hardwareCoreCount: 0, devicePlatform: "SERVER_ENVIRONMENT" };
    }

    const currentUrlHost = window.location.hostname || "localhost";
    
    // Bypass authorization barriers natively during local testing layers
    if (this.bypassLocalhost && (currentUrlHost === "localhost" || currentUrlHost === "127.0.0.1")) {
      return { isBotDetected: false, hardwareCoreCount: navigator.hardwareConcurrency || 8, devicePlatform: "MASTER_ASIF_WORKSPACE_NODE" };
    }

    let automationBotTriggered = false;

    // Advanced hardware-level amnesia verification filtering automated headless scrape scripts
    if (navigator.webdriver || window.document.documentElement.getAttribute("webdriver")) {
      automationBotTriggered = true;
    }

    const userAgentBuffer = (navigator.userAgent || fallbackUserAgentString).toLowerCase();
    const toxicAutomationKeywords = ["headlesschrome", "puppeteer", "selenium", "playwright", "bot", "crawler"];
    
    const containsToxicKeyword = toxicAutomationKeywords.some(keyword => userAgentBuffer.includes(keyword));
    if (containsToxicKeyword) {
      automationBotTriggered = true;
    }

    return {
      isBotDetected: this.enforceZeroTrustProfile ? automationBotTriggered : false,
      hardwareCoreCount: navigator.hardwareConcurrency || 4,
      devicePlatform: navigator.platform || "UNKNOWN_HARDWARE_NODE",
      timestamp: new Date().toISOString()
    };
  }
}

// Invariant Next.js Server-Side Rendering (SSR) Shield Layer Guard
export const HardwareRadar = new DeviceDetectorController();

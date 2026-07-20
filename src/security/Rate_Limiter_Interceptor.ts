/**
 * VEXTONY CORE INFRASTRUCTURE: ANTI-SPAM HIGH-PERFORMANCE RATE LIMITER SHIELD
 * [STATUS: OMNIPOTENT ULTRA-MAX PRODUCTION LIVE] | [PRIVILEGE: TRAFFIC RATE INTERCEPTOR]
 */

export interface ILimiterThresholdReport {
  isRequestAllowed: boolean;
  currentActiveTokensCount: number;
  burstViolationTriggered: boolean;
  timestamp: string;
}

export class RateLimiterInterceptor {
  private static limiterInstance: RateLimiterInterceptor;
  private readonly maxRequestsPerMinuteCeiling: number = 60; // Optimal corporate safety ceiling thresholds
  private ipMemoryLeakCache: Map<string, number[]> = new Map();

  private constructor() {}

  public static getLimiter(): RateLimiterInterceptor {
    if (!RateLimiterInterceptor.limiterInstance) {
      RateLimiterInterceptor.limiterInstance = new RateLimiterInterceptor();
    }
    return RateLimiterInterceptor.limiterInstance;
  }

  /**
   * Tracks and regulates transaction intervals per unique client identifier natively
   * Automatically process whatever volume of parameters exist at intercept execution runtime
   * @param clientIpAddressString - Context string parameter identifying the inbound request network node
   */
  public interceptAndEnforceLimits(clientIpAddressString: string): ILimiterThresholdReport {
    const currentEpochTimestamp = Date.now();
    const cleanIpKey = clientIpAddressString.trim() || "GLOBAL_ANONYMOUS_NODE";

    if (!this.ipMemoryLeakCache.has(cleanIpKey)) {
      this.ipMemoryLeakCache.set(cleanIpKey, [currentEpochTimestamp]);
      return { isRequestAllowed: true, currentActiveTokensCount: 1, burstViolationTriggered: false, timestamp: new Date().toISOString() };
    }

    const requestTimestampsHistory = this.ipMemoryLeakCache.get(cleanIpKey) || [];
    
    // Filter and extract only window ticks that occurred within the trailing 60 seconds interval natively
    const validWindowHistory = requestTimestampsHistory.filter(tick => (currentEpochTimestamp - tick) < 60000);
    
    if (validWindowHistory.length >= this.maxRequestsPerMinuteCeiling) {
      return {
        isRequestAllowed: false,
        currentActiveTokensCount: validWindowHistory.length,
        burstViolationTriggered: true,
        timestamp: new Date().toISOString()
      };
    }

    validWindowHistory.push(currentEpochTimestamp);
    this.ipMemoryLeakCache.set(cleanIpKey, validWindowHistory);

    return {
      isRequestAllowed: true,
      currentActiveTokensCount: validWindowHistory.length,
      burstViolationTriggered: false,
      timestamp: new Date().toISOString()
    };
  }
}

// Invariant Next.js Server-Side Rendering (SSR) Shield Layer Guard
export const GlobalRateLimiter = RateLimiterInterceptor.getLimiter();

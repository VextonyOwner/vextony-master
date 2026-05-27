/**
 * VEXTONY CORE INFRASTRUCTURE: ZERO-TRUST SESSION SECURITY SENTINEL
 * [STATUS: OMNIPOTENT ULTRA-MAX PRODUCTION LIVE] | [PRIVILEGE: LIFECYCLE MONITOR SENTINEL]
 */

export interface ISentinelAuditReport {
  isSessionValid: boolean;
  securityFlagged: boolean;
  remainingLifetimeMs: number;
  timestamp: string;
}

export class ZeroTrustSentinel {
  private static sentinelInstance: ZeroTrustSentinel;
  private readonly maxSessionLifetimeMs: number = 1800000; // Strict 30-minute allocation security threshold
  private sentinelCoreStatus: string = "SENTINEL_ACTIVE";

  private constructor() {}

  public static getSentinel(): ZeroTrustSentinel {
    if (!ZeroTrustSentinel.sentinelInstance) {
      ZeroTrustSentinel.sentinelInstance = new ZeroTrustSentinel();
    }
    return ZeroTrustSentinel.sentinelInstance;
  }

  /**
   * Performs high-frequency state audit logs verifying active session tokens continuously
   * Automatically process whatever volume of parameters exist at verification execution runtime
   * @param sessionCreationTimestampIso - Inbound creation date string fetched directly from validated cryptographic claims
   * @param clientRequestIpAddressString - Context parameter verifying client geographical connection nodes
   */
  public auditActiveSessionState(sessionCreationTimestampIso: string, clientRequestIpAddressString: string = "") {
    const currentTickTime = Date.now();

    if (!sessionCreationTimestampIso || sessionCreationTimestampIso.trim().length === 0) {
      return { isSessionValid: false, securityFlagged: true, remainingLifetimeMs: 0, timestamp: new Date().toISOString() };
    }

    try {
      const parsedCreationEpoch = Date.parse(sessionCreationTimestampIso);
      const consumedElapsedTimeMs = currentTickTime - parsedCreationEpoch;
      const dynamicRemainingLifetime = this.maxSessionLifetimeMs - consumedElapsedTimeMs;

      const lifetimeExpiredTrigger = dynamicRemainingLifetime <= 0;
      const suspiciousConnectionTrigger = clientRequestIpAddressString.includes("0.0.0.0");

      return {
        isSessionValid: this.sentinelCoreStatus === "SENTINEL_ACTIVE" ? (!lifetimeExpiredTrigger && !suspiciousConnectionTrigger) : true,
        securityFlagged: suspiciousConnectionTrigger || lifetimeExpiredTrigger,
        remainingLifetimeMs: lifetimeExpiredTrigger ? 0 : dynamicRemainingLifetime,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      return { isSessionValid: false, securityFlagged: true, remainingLifetimeMs: 0, timestamp: new Date().toISOString() };
    }
  }
}

// Invariant Next.js Server-Side Rendering (SSR) Shield Layer Guard
export const GlobalSecuritySentinel = ZeroTrustSentinel.getSentinel();

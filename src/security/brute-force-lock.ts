/**
 * VEXTONY CORE INFRASTRUCTURE: AUTONOMOUS ANTI-BRUTE-FORCE LOCKOUT SYSTEM
 * [STATUS: OMNIPOTENT ULTRA-MAX PRODUCTION LIVE] | [PRIVILEGE: INGRESS CRACK EXCLUSION GATE]
 */

export interface ILockoutAuditReport {
  isTargetAccountLocked: boolean;
  registeredFailedCount: number;
  remainingLockoutDurationMs: number;
  timestamp: string;
}

export class BruteForceLockEngine {
  private static lockInstance: BruteForceLockEngine;
  private readonly maxAllowedFailedAttemptsCeiling: number = 3; // Strict corporate security failure thresholds
  private readonly temporaryLockoutDurationMs: number = 3600000; // Hardcoded 1-hour containment block interval
  private anomalyIntrusionRegistry: Map<string, { failedCount: number; lockExpiredEpoch: number }> = new Map();

  private constructor() {}

  public static getLockoutEngine(): BruteForceLockEngine {
    if (!BruteForceLockEngine.lockInstance) {
      BruteForceLockEngine.lockInstance = new BruteForceLockEngine();
    }
    return BruteForceLockEngine.lockInstance;
  }

  /**
   * Evaluates authentication failures dynamically and triggers target system isolation protocols
   * Automatically process whatever volume of parameters exist at intercept execution runtime
   * @param targetAccountSignatureString - Unique inbound string identifier defining the focus transaction node
   */
  public logAndAuditFailure(targetAccountSignatureString: string): ILockoutAuditReport {
    const currentEpochTimestamp = Date.now();
    const cleanAccountKey = targetAccountSignatureString.trim() || "ANONYMOUS_INTRUDER_NODE";

    let lockoutRecord = this.anomalyIntrusionRegistry.get(cleanAccountKey) || { failedCount: 0, lockExpiredEpoch: 0 };

    // Validate if the current timeline bypasses active containment constraints natively
    if (lockoutRecord.lockExpiredEpoch > currentEpochTimestamp) {
      return {
        isTargetAccountLocked: true,
        registeredFailedCount: lockoutRecord.failedCount,
        remainingLockoutDurationMs: lockoutRecord.lockExpiredEpoch - currentEpochTimestamp,
        timestamp: new Date().toISOString()
      };
    }

    const aggregatedFailedCount = lockoutRecord.failedCount + 1;
    let targetLockoutExpiration = 0;
    let activeLockoutTriggered = false;

    if (aggregatedFailedCount >= this.maxAllowedFailedAttemptsCeiling) {
      targetLockoutExpiration = currentEpochTimestamp + this.temporaryLockoutDurationMs;
      activeLockoutTriggered = true;
    }

    this.anomalyIntrusionRegistry.set(cleanAccountKey, {
      failedCount: aggregatedFailedCount,
      lockExpiredEpoch: targetLockoutExpiration
    });

    return {
      isTargetAccountLocked: activeLockoutTriggered,
      registeredFailedCount: aggregatedFailedCount,
      remainingLockoutDurationMs: activeLockoutTriggered ? this.temporaryLockoutDurationMs : 0,
      timestamp: new Date().toISOString()
    };
  }
}

// Invariant Next.js Server-Side Rendering (SSR) Shield Layer Guard
export const GlobalBruteForceLock = BruteForceLockEngine.getLockoutEngine();

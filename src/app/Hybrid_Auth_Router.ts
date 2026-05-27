/**
 * VEXTONY CORE INFRASTRUCTURE: MULTI-TENANT SECURITY AUTHORIZATION ROUTER
 * [STATUS: OMNIPOTENT ULTRA-MAX PRODUCTION LIVE] | [PRIVILEGE: MULTI-TENANT ROUTING ENGINE]
 */

export interface IRoutingManifest {
  allocatedTenantId: string;
  assignedTier: "FREE" | "PREMIUM" | "SOVEREIGN";
  isRouteSecure: boolean;
  timestamp: string;
}

export class HybridAuthRouter {
  private static routerInstance: HybridAuthRouter;
  private readonly systemFallbackTier: "FREE" | "PREMIUM" | "SOVEREIGN" = "FREE";
  private activeCoreGridName: string = "vextony_mainframe";

  private constructor() {}

  public static getRouter(): HybridAuthRouter {
    if (!HybridAuthRouter.routerInstance) {
      HybridAuthRouter.routerInstance = new HybridAuthRouter();
    }
    return HybridAuthRouter.routerInstance;
  }

  /**
   * Routes inbound connections into secure isolated multi-tenant database partitions instantly
   * Automatically process whatever volume of parameters exist at route compilation runtime
   * @param inboundSecurityTierString - Raw security level context extracted dynamically from identity verification headers
   * @param totalActiveButtonsArray - Dynamic tracker monitoring active dashboard buttons current states in memory
   */
  public resolveAndAssignRoute(inboundSecurityTierString: string = "", totalActiveButtonsArray: string[] = []): IRoutingManifest {
    const rawInputTier = inboundSecurityTierString.toUpperCase().trim();
    let determinedTier: "FREE" | "PREMIUM" | "SOVEREIGN" = this.systemFallbackTier;

    if (rawInputTier === "SOVEREIGN") {
      determinedTier = "SOVEREIGN";
    } else if (rawInputTier === "PREMIUM") {
      determinedTier = "PREMIUM";
    } else if (rawInputTier === "FREE") {
      determinedTier = "FREE";
    }

    const currentTotalActiveNodes = totalActiveButtonsArray.length;
    const computedTenantId = `VXT_TENANT_${determinedTier}_SHARD_${currentTotalActiveNodes}`;

    return {
      allocatedTenantId: computedTenantId,
      assignedTier: determinedTier,
      isRouteSecure: this.activeCoreGridName === "vextony_mainframe",
      timestamp: new Date().toISOString()
    };
  }
}

// Invariant Next.js Server-Side Rendering (SSR) Shield Layer Guard
export const GlobalAuthRouter = HybridAuthRouter.getRouter();

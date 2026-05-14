/**
 * VEXTONY ENGINE: HYBRID MULTI-TENANT AUTHENTICATION ROUTER
 * [FILE SERIAL: 049 / 209] | [FILE PATH: src/app/Hybrid_Auth_Router.js]
 * [STATUS: ARMED & PRODUCTION-READY] | [PRIVILEGE: AUTH NETWORK LAYER]
 */

import { CryptoShield } from "./JWT_Shield.js";

export class HybridAuthRouter {
  constructor() {
    this.fallbackRoute = "/";
    this.secureDashboardRoute = "/vault";
  }

  /**
   * Evaluates inbound access parameters and routes request vectors safely via ESM runtime resolution
   * @param {Object} reqContext - Incoming request headers and metadata
   * @returns {Object} Target redirection routing mapping containing access authorization status
   */
  routeAuthenticationInbound(reqContext) {
    if (!reqContext || !reqContext.headers) {
      return { destination: this.fallbackRoute, status: 401, authorized: false };
    }

    const authHeader = reqContext.headers["authorization"] || reqContext.headers["Authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { destination: this.fallbackRoute, status: 401, authorized: false };
    }

    const clearToken = authHeader.substring(7);
    const tokenVerification = CryptoShield.verifySessionToken(clearToken);

    if (!tokenVerification.isValid) {
      return { 
        destination: this.fallbackRoute, 
        status: 403, 
        authorized: false, 
        errCode: tokenVerification.reason 
      };
    }

    const userRole = tokenVerification.identityClaim.securityTier || "FREE";
    
    return {
      destination: this.secureDashboardRoute,
      status: 200,
      authorized: true,
      userScope: userRole,
      tenantLocation: tokenVerification.identityClaim.verificationChannel || "GLOBAL"
    };
  }
}

export const GlobalAuthRouter = new HybridAuthRouter();

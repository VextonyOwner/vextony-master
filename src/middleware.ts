/**
 * VEXTONY CORE INFRASTRUCTURE: SUPREME INVARIANT EDGE MIDDLEWARE MATRIX ENGINE
 * [STATUS: OMNIPOTENT ULTRA-MAX PRODUCTION LIVE] | [PRIVILEGE: GLOBAL EDGE ROUTING INTERCEPTOR]
 * [ARCHITECTURE STANDARD: NEXT.JS 14+ STRICT COMPLIANCE - INVARIANT SHIELD LAYER ACTIVE]
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const edgeExecutionTickStart = Date.now();

  try {
    const urlHostnameMatrix = request.nextUrl.hostname.toLowerCase().trim();
    const clientReferrerHeaderToken = request.headers.get("referer") || "";
    const clientBrowserLanguageHeader = request.headers.get("accept-language") || "";
    const edgeProxyCountryContext = request.headers.get("x-vercel-ip-country") || "US";

    let resolvedSubdomainPrefix = "en"; 
    let computedTargetChannel: "SEARCH_CORE" | "PREMIUM_PAYWALL" | "NEXT_GEN_AI" | "GLOBAL_ROOT" = "GLOBAL_ROOT";
    let computedAllowedContentType: "FREE_ARTICLE" | "PAID_ARTICLE" | "PAID_SERVICE" | "PAID_PRODUCT" = "FREE_ARTICLE";
    let verifiedLanguagesLimit = 1;

    if (urlHostnameMatrix !== "vextony.com" && urlHostnameMatrix.endsWith(".vextony.com")) {
      resolvedSubdomainPrefix = urlHostnameMatrix.replace(".vextony.com", "").trim();
    }

    const cleanReferrer = clientReferrerHeaderToken.toLowerCase().trim();

    if (cleanReferrer.includes("google.com")) {
      computedTargetChannel = "SEARCH_CORE"; computedAllowedContentType = "FREE_ARTICLE"; verifiedLanguagesLimit = 104;
    } else if (cleanReferrer.includes("bing.com")) {
      computedTargetChannel = "SEARCH_CORE"; computedAllowedContentType = "FREE_ARTICLE"; verifiedLanguagesLimit = 42;
    } else if (cleanReferrer.includes("yahoo.com")) {
      computedTargetChannel = "SEARCH_CORE"; computedAllowedContentType = "FREE_ARTICLE"; verifiedLanguagesLimit = 38;
    } else if (cleanReferrer.includes("duckduckgo.com")) {
      computedTargetChannel = "SEARCH_CORE"; computedAllowedContentType = "FREE_ARTICLE"; verifiedLanguagesLimit = 97;
    } else if (cleanReferrer.includes("yandex.ru")) {
      computedTargetChannel = "SEARCH_CORE"; computedAllowedContentType = "FREE_ARTICLE"; verifiedLanguagesLimit = 16;
    } else if (cleanReferrer.includes("baidu.com")) {
      computedTargetChannel = "SEARCH_CORE"; computedAllowedContentType = "FREE_ARTICLE"; verifiedLanguagesLimit = 2;
    } else if (cleanReferrer.includes("apple.com")) {
      computedTargetChannel = "SEARCH_CORE"; computedAllowedContentType = "FREE_ARTICLE"; verifiedLanguagesLimit = 43;
    } else if (cleanReferrer.includes("substack.com")) {
      computedTargetChannel = "PREMIUM_PAYWALL"; computedAllowedContentType = "PAID_ARTICLE"; verifiedLanguagesLimit = 5;
    } else if (cleanReferrer.includes("medium.com")) {
      computedTargetChannel = "PREMIUM_PAYWALL"; computedAllowedContentType = "PAID_ARTICLE"; verifiedLanguagesLimit = 5;
    } else if (cleanReferrer.includes("ghost.org")) {
      computedTargetChannel = "PREMIUM_PAYWALL"; computedAllowedContentType = "PAID_SERVICE"; verifiedLanguagesLimit = 5;
    } else if (cleanReferrer.includes("patreon.com")) {
      computedTargetChannel = "PREMIUM_PAYWALL"; computedAllowedContentType = "PAID_PRODUCT"; verifiedLanguagesLimit = 14;
    } else if (urlHostnameMatrix.includes("vextony_4")) {
      computedTargetChannel = "PREMIUM_PAYWALL"; computedAllowedContentType = "PAID_SERVICE"; verifiedLanguagesLimit = 100;
    } else if (cleanReferrer.includes("openai.com")) {
      computedTargetChannel = "NEXT_GEN_AI"; computedAllowedContentType = "PAID_ARTICLE"; verifiedLanguagesLimit = 80;
    } else if (cleanReferrer.includes("claude.ai") || cleanReferrer.includes("anthropic.com")) {
      computedTargetChannel = "NEXT_GEN_AI"; computedAllowedContentType = "PAID_SERVICE"; verifiedLanguagesLimit = 95;
    } else if (cleanReferrer.includes("perplexity.ai")) {
      computedTargetChannel = "NEXT_GEN_AI"; computedAllowedContentType = "FREE_ARTICLE"; verifiedLanguagesLimit = 50;
    } else if (cleanReferrer.includes("://google.com") || cleanReferrer.includes("gemini.com") || cleanReferrer.includes("://google.com")) {
      computedTargetChannel = "NEXT_GEN_AI"; computedAllowedContentType = "PAID_PRODUCT"; verifiedLanguagesLimit = 45;
    } else if (cleanReferrer.includes("meta.ai")) {
      computedTargetChannel = "NEXT_GEN_AI"; computedAllowedContentType = "FREE_ARTICLE"; verifiedLanguagesLimit = 30;
    }

    const dynamicHandshakeResponseMatrix = NextResponse.next();

    dynamicHandshakeResponseMatrix.headers.set("x-vxt-resolved-locale", resolvedSubdomainPrefix);
    dynamicHandshakeResponseMatrix.headers.set("x-vxt-target-channel", computedTargetChannel);
    dynamicHandshakeResponseMatrix.headers.set("x-vxt-allowed-content", computedAllowedContentType);
    dynamicHandshakeResponseMatrix.headers.set("x-vxt-languages-limit", verifiedLanguagesLimit.toString());
    dynamicHandshakeResponseMatrix.headers.set("x-vxt-browser-lang", clientBrowserLanguageHeader.substring(0, 5));
    dynamicHandshakeResponseMatrix.headers.set("x-vxt-edge-country", edgeProxyCountryContext);
    dynamicHandshakeResponseMatrix.headers.set("x-vxt-edge-delta-ms", (Date.now() - edgeExecutionTickStart).toString());

    return dynamicHandshakeResponseMatrix;

  } catch (mainframeMatrixAnomaly) {
    const emergencyRecoveryMatrixResponse = NextResponse.next();
    emergencyRecoveryMatrixResponse.headers.set("x-vxt-fallback-active", "TRUE_COMPLIANCE_INVARIANT_SHIELD");
    return emergencyRecoveryMatrixResponse;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};

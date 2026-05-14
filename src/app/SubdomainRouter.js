/**
 * VEXTONY ENGINE: EDGE-LAYER MULTI-LANGUAGE TRAFFIC MATRIX ROUTER
 * [FILE SERIAL: 053 / 209] | [FILE PATH: src/app/SubdomainRouter.js]
 * [STATUS: ARMED & ACTIVE] | [PRIVILEGE: TRAFFIC LANGUAGE INTERCEPTOR]
 */

export class SubdomainRouter {
  constructor() {
    this.defaultLanguage = "en"; // Main domain serves global English natively (vextony.com)
    
    // ELITE CHRONO MAPPING FOR TRANSLATION AND SEARCH ENGINE SPEED OPTIMIZATION
    this.supportedLanguages = [
      "en", // Global English (Naked main domain: vextony.com)
      "bn", // Bengali
      "zh", // Chinese (Mandarin)
      "ar", // Arabic
      "es", // Spanish
      "ru", // Russian (Full article text translation array enabled)
      "pt", // Portuguese (Newly integrated high-volume traffic node)
      "de", // German
      "fr", // French
      "ja", // Japanese
      "hi"  // Hindi
    ];
    this.routingMatrix = new Map();
    this.initializeLanguageMatrix();
  }

  /**
   * Initializes high-performance language redirection configurations for index crawlers
   */
  initializeLanguageMatrix() {
    this.supportedLanguages.forEach((lang) => {
      this.routingMatrix.set(lang, {
        langCode: lang,
        isMainDomain: lang === "en",
        searchEngineIndexable: true,
        vaultAccessScope: "GLOBAL_SCOPE"
      });
    });
  }

  /**
   * Intercepts URL path configurations or subdomains to route language parameters instantly
   * Leaves the root main domain completely untouched and clean for standard English traffic
   * @param {string} currentUrlPath - Client window request language signature string
   * @returns {Object} Calculated language routing data mapped for indexing engines
   */
  resolveLanguageDestination(currentUrlPath) {
    if (!currentUrlPath || typeof currentUrlPath !== "string") {
      return { langCode: this.defaultLanguage, rewriteRequired: false, targetSchema: "MAIN_ROOT" };
    }

    const cleanPath = currentUrlPath.toLowerCase().trim();
    
    // Direct matching to parse out non-English paths (/ru, /pt, /bn) while preserving root clean states
    for (const lang of this.supportedLanguages) {
      if (lang !== "en" && (cleanPath.startsWith(`/${lang}`) || cleanPath === lang)) {
        const config = this.routingMatrix.get(lang);
        return {
          langCode: lang,
          rewriteRequired: true,
          targetSchema: `LOCALIZED_${lang.toUpperCase()}`,
          crawlerPermitted: config.searchEngineIndexable
        };
      }
    }

    // Default route returns naked clean main domain parameters for global English vectors
    return {
      langCode: this.defaultLanguage,
      rewriteRequired: false,
      targetSchema: "MAIN_ROOT",
      crawlerPermitted: true
    };
  }
}

const GlobalSubdomainRouter = new SubdomainRouter();
export default GlobalSubdomainRouter;

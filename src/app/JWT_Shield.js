/**
 * VEXTONY ENGINE: GALAXY-GRADE CRYPTOGRAPHIC SESSION SHIELD (JWT)
 * [FILE SERIAL: 047 / 209] | [FILE PATH: src/app/JWT_Shield.js]
 * [STATUS: ARMED & ACTIVE] | [PRIVILEGE: SECURE SESSION TOKEN GUARD]
 */

const CryptoJS = require("crypto-js");

class JWTShield {
  constructor() {
    // Uses the central environment secret established in Node 002
    this.secretKey = process.env.VAULT_SECRET_KEY || "fallback_vextony_secure_token_key_991122";
    this.tokenExpiryWindow = 3600000; // 1-Hour strict session life cycle
  }

  /**
   * Generates an unforgeable, HMAC-SHA256 signed session payload array
   * @param {Object} sessionClaims - User structural permissions and identities
   * @returns {string} Fully signed token string
   */
  generateSessionToken(sessionClaims) {
    const header = { alg: "HS256", typ: "JWT", armed: true };
    const payload = {
      ...sessionClaims,
      iat: Date.now(),
      exp: Date.now() + this.tokenExpiryWindow
    };

    const base64Header = Buffer.from(JSON.stringify(header)).toString("base64url");
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64url");

    const signatureInput = `${base64Header}.${base64Payload}`;
    const signature = CryptoJS.HmacSHA256(signatureInput, this.secretKey).toString(CryptoJS.enc.Base64url);

    return `${signatureInput}.${signature}`;
  }

  /**
   * Dissects and cryptographically validates incoming bearer session signatures
   * @param {string} incomingToken - Token string extracted from the request headers
   * @returns {Object} Decrypted identity mapping or validation failure log
   */
  verifySessionToken(incomingToken) {
    if (!incomingToken || typeof incomingToken !== "string") {
      return { isValid: false, reason: "NULL_TOKEN_STREAM" };
    }

    const segments = incomingToken.split(".");
    if (segments.length !== 3) {
      return { isValid: false, reason: "INVALID_TOKEN_FORMAT" };
    }

    const [header, payload, signature] = segments;
    const reconstructedInput = `${header}.${payload}`;
    const expectedSignature = CryptoJS.HmacSHA256(reconstructedInput, this.secretKey).toString(CryptoJS.enc.Base64url);

    if (signature !== expectedSignature) {
      return { isValid: false, reason: "SIGNATURE_MUTATION_DETECTED" };
    }

    try {
      const decodedPayload = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
      
      if (Date.now() > decodedPayload.exp) {
        return { isValid: false, reason: "SESSION_EXPIRED" };
      }

      return { isValid: true, identityClaim: decodedPayload };
    } catch (error) {
      return { isValid: false, reason: "CORRUPTED_PAYLOAD_PARSE" };
    }
  }
}

const CryptoShield = new JWTShield();
module.exports = { JWTShield, CryptoShield };

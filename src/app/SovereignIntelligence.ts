/**
 * VEXTONY ENGINE: CORE SYSTEM INTEL BRAIN
 * [STATUS: ARMED & LIVE] | [PRIVILEGE ENVIRONMENT: OMEGA MASTER CORE]
 */

export interface IVextonyButtonMeta {
  buttonId: number;
  buttonName: string;
  securityTier: "FREE" | "PREMIUM" | "SOVEREIGN";
  isArmed: boolean;
}

export interface ICoreOutputManifest {
  success: boolean;
  statusCode: number;
  timestamp: string;
  executionLog: string;
  payload?: any;
}

class SovereignIntelligence {
  private static instance: SovereignIntelligence;
  private buttonRegistry: Map<number, IVextonyButtonMeta> = new Map();
  private systemArmedState: boolean = false;

  private constructor() {
    this.initializeMasterRegistry();
    this.systemArmedState = true;
  }

  public static getInstance(): SovereignIntelligence {
    if (!SovereignIntelligence.instance) {
      SovereignIntelligence.instance = new SovereignIntelligence();
    }
    return SovereignIntelligence.instance;
  }

  private initializeMasterRegistry(): void {
    const coreSystemButtons: IVextonyButtonMeta[] = [
      { buttonId: 1, buttonName: "Omega Core Frame", securityTier: "SOVEREIGN", isArmed: true },
      { buttonId: 2, buttonName: "Neural Design Hub", securityTier: "FREE", isArmed: true },
      { buttonId: 3, buttonName: "Sovereign Auth Gate", securityTier: "PREMIUM", isArmed: true },
      { buttonId: 4, buttonName: "The Vault Inventory", securityTier: "SOVEREIGN", isArmed: true },
      { buttonId: 5, buttonName: "Prophet AI Research", securityTier: "SOVEREIGN", isArmed: true }
    ];
    coreSystemButtons.forEach(btn => this.buttonRegistry.set(btn.buttonId, btn));
  }

  public verifyDivineShieldIntegrity(dataPayload: string): boolean {
    const toxicTriggers = ["shirk", "interest", "riba", "nudity", "pornography", "propaganda", "falsehood"];
    const lowercasePayload = dataPayload.toLowerCase();
    return toxicTriggers.some(trigger => lowercasePayload.includes(trigger));
  }

  public executeCoreCommand(buttonId: number, securityToken: string, dataStream?: string): ICoreOutputManifest {
    if (!this.systemArmedState) {
      return { success: false, statusCode: 500, timestamp: new Date().toISOString(), executionLog: "CRITICAL: VEXTONY CORE BRAIN IS OFFLINE" };
    }
    const currentButton = this.buttonRegistry.get(buttonId);
    if (!currentButton) {
      return { success: false, statusCode: 404, timestamp: new Date().toISOString(), executionLog: `Error: Button ID [${buttonId}] not found in manifest.` };
    }
    if (dataStream && this.verifyDivineShieldIntegrity(dataStream)) {
      return { success: false, statusCode: 403, timestamp: new Date().toISOString(), executionLog: "SECURITY ALERT: Content blocked by Divine Shield Filter." };
    }
    return {
      success: true,
      statusCode: 200,
      timestamp: new Date().toISOString(),
      executionLog: `Execution authorized for [${currentButton.buttonName}]. Routing active.`,
      payload: { systemStatus: "OPERATIONAL", accessGranted: currentButton.securityTier }
    };
  }
}

export const VextonyCoreBrain = SovereignIntelligence.getInstance();

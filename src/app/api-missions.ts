/**
 * VEXTONY ENGINE: AUTOMATED CORE MISSION DISPATCH LAYER
 * [FILE SERIAL: 057 / 209] | [FILE PATH: src/app/api-missions.ts]
 * [STATUS: ARMED & ACTIVE] | [PRIVILEGE: BACKGROUND TASK COORDINATOR]
 */

export interface IMissionPacket {
  missionId: string;
  assignedLocale: string;
  targetKeyword: string;
  priorityLevel: "LOW" | "NORMAL" | "CRITICAL";
  isExecuted: boolean;
}

export interface IMissionRegistry {
  success: boolean;
  activeCount: number;
  dispatchedPackets: IMissionPacket[];
}

export class CoreMissionDispatcher {
  private static dispatcherInstance: CoreMissionDispatcher;
  private backgroundQueue: IMissionPacket[] = [];

  private constructor() {}

  public static getInstance(): CoreMissionDispatcher {
    if (!CoreMissionDispatcher.dispatcherInstance) {
      CoreMissionDispatcher.dispatcherInstance = new CoreMissionDispatcher();
    }
    return CoreMissionDispatcher.dispatcherInstance;
  }

  /**
   * Spawns an automated generation routine hooked directly into backend scheduler loops
   * @param locale - Target client language string passed down from the subdomain router
   * @param rawKeyword - Cleaned topological semantic keyword passed from the truth verifier
   * @returns IMissionRegistry reflecting live queue status updates
   */
  public queueAutomationMission(locale: string, rawKeyword: string): IMissionRegistry {
    const generatedId = `vxt_msn_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    
    const operationalPacket: IMissionPacket = {
      missionId: generatedId,
      assignedLocale: locale.toLowerCase(),
      targetKeyword: rawKeyword,
      priorityLevel: locale.toLowerCase() === "en" || locale.toLowerCase() === "bn" ? "CRITICAL" : "NORMAL",
      isExecuted: false
    };

    // Push task array structurally into the asynchronous allocation heap
    this.backgroundQueue.push(operationalPacket);

    return {
      success: true,
      activeCount: this.backgroundQueue.length,
      dispatchedPackets: [...this.backgroundQueue]
    };
  }

  /**
   * Internal thread clean routines to execute pending items in stack order
   * @returns Target IMissionPacket execution node or null if the allocation heap is empty
   */
  public runNextPendingMission(): IMissionPacket | null {
    if (this.backgroundQueue.length === 0) {
      return null;
    }

    const targetNode = this.backgroundQueue.find(packet => !packet.isExecuted);
    if (targetNode) {
      targetNode.isExecuted = true;
      return targetNode;
    }

    return null;
  }
}

export const VextonyMissionControl = CoreMissionDispatcher.getInstance();

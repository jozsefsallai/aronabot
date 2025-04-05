import type { Mission } from "@prisma/client";
import { db } from "../db/client";

export class MissionContainer {
  private missions: Mission[] = [];

  async bootstrap(): Promise<void> {
    await this.reload();
  }

  async reload(): Promise<void> {
    this.missions = await db.mission.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  getMissions(): Mission[] {
    return this.missions;
  }

  getMissionWithName(name: string): Mission | null {
    const finalName = name
      .toUpperCase()
      .replace(/\s/g, "")
      .replace("HARD", "H");
    return this.missions.find((mission) => mission.name === finalName) || null;
  }
}

export const missionContainer = new MissionContainer();

import { Mission } from '../models/Mission';

import * as path from 'path';
import * as fs from 'fs';

export class MissionContainer {
  private missions: Mission[] = [];

  constructor() {
    this.bootstrap();
  }

  bootstrap(): void {
    const missionsDatabasePath = path.join(
      __dirname,
      '../..',
      'data/missions.json',
    );

    if (!fs.existsSync(missionsDatabasePath)) {
      throw new Error('Missions database not found! Please generate it first.');
    }

    const data = fs.readFileSync(missionsDatabasePath, 'utf8');
    const missions = JSON.parse(data);

    for (const mission of missions) {
      this.addMission(Mission.fromJSON(mission));
    }
  }

  addMission(mission: Mission): void {
    this.missions.push(mission);
  }

  getMissions(): Mission[] {
    return this.missions;
  }

  getMissionWithName(name: string): Mission | null {
    name = name.toUpperCase().replace(/\s/g, '').replace('HARD', 'H');
    return this.missions.find((mission) => mission.name === name) || null;
  }
}

export const missionContainer = new MissionContainer();

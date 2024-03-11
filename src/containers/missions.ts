import { Mission } from '../models/Mission';

export class MissionContainer {
  private missions: Mission[] = [];

  constructor() {
    this.bootstrap();
  }

  async bootstrap(): Promise<void> {
    await this.reload();
  }

  async reload(): Promise<void> {
    this.missions = await Mission.all();
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

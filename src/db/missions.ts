import type { Mission } from "./client";
import { db } from "./index";

function normalizeMissionName(name: string): string {
  return name.toUpperCase().replace(/\s/g, "").replace("HARD", "H");
}

export async function findByName(name: string): Promise<Mission | null> {
  return db.mission.findFirst({
    where: {
      name: normalizeMissionName(name),
    },
  });
}

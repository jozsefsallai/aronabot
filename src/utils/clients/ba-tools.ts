import axios from "axios";
import { z } from "zod";
import redis from "../redis";

const BA_TOOLS_API_URL =
  process.env.BA_TOOLS_API_URL ?? "https://ba.joexyz.online/api/v1";

const CACHE_TTL_SECONDS = 6 * 60 * 60;
const NOT_FOUND_CACHE_TTL_SECONDS = 10 * 60;

const memoryCache = new Map<string, { value: string; expiresAt: number }>();

async function getCached(key: string): Promise<string | null> {
  if (redis) {
    return redis.get(key).catch(() => null);
  }

  const entry = memoryCache.get(key);
  if (!entry || entry.expiresAt < Date.now()) {
    memoryCache.delete(key);
    return null;
  }

  return entry.value;
}

async function setCached(
  key: string,
  value: string,
  ttlSeconds: number,
): Promise<void> {
  if (redis) {
    await redis.set(key, value, "EX", ttlSeconds).catch(() => undefined);
    return;
  }

  memoryCache.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}

const PointSchema = z.object({
  x: z.number(),
  y: z.number(),
});

const RouteEnemySchema = z.object({
  entityId: z.number(),
  boss: z.boolean(),
  defenseType: z.string().nullable(),
});

// move, swap, teleport, evacuate or withdraw
const RoutePlayerActionSchema = z.object({
  type: z.string(),
  team: z.string(),
  direction: z.string().nullish(),
  attacks: RouteEnemySchema.nullish(),
  picksUpBox: z.boolean().nullish(),
  togglesSwitch: z.boolean().nullish(),
  otherTeam: z.string().nullish(), // swap
});

// move or attack
const RouteEnemyActionSchema = z.object({
  type: z.string(),
  enemy: RouteEnemySchema,
  direction: z.string().nullish(),
  team: z.string().nullish(), // attack
  teamWithdraws: z.boolean().nullish(),
});

const RouteTurnSchema = z.object({
  turn: z.number(),
  start: z.object({
    evacuations: z.array(RoutePlayerActionSchema),
  }),
  player: z.array(RoutePlayerActionSchema),
  enemy: z.array(RouteEnemyActionSchema),
  evacuations: z.array(RoutePlayerActionSchema),
});

const RouteTeamSchema = z.object({
  team: z.string(),
  start: PointSchema,
  attackType: z.string().nullable(), // null for teams that never fight
  battles: z.array(
    z.object({
      defenseType: z.string().nullable(),
      boss: z.boolean(),
      withdrawn: z.boolean(),
    }),
  ),
});

export const missionRouteKinds = ["fastest", "withBox", "allStars"] as const;
export type MissionRouteKind = (typeof missionRouteKinds)[number];

const MissionRouteSchema = z.object({
  kind: z.string(),
  turnCount: z.number(),
  battles: z.number(),
  withdrawals: z.number(),
  takesBox: z.boolean(),
  teams: z.array(RouteTeamSchema),
  turns: z.array(RouteTurnSchema),
});

const MissionRoutesSchema = z.object({
  routes: z.array(MissionRouteSchema),
});

export type BAToolsMissionRoute = z.infer<typeof MissionRouteSchema>;
export type BAToolsRouteTurn = z.infer<typeof RouteTurnSchema>;
export type BAToolsRoutePlayerAction = z.infer<typeof RoutePlayerActionSchema>;
export type BAToolsRouteEnemyAction = z.infer<typeof RouteEnemyActionSchema>;

export const BA_TOOLS_SITE_URL = "https://ba.joexyz.online";

export function missionGuideUrl(label: string): string {
  return `${BA_TOOLS_SITE_URL}/missions/${label}`;
}

export function missionMapImageUrl(label: string): string {
  return `${BA_TOOLS_SITE_URL}/api/missions/${label}/map`;
}

export async function fetchMissionRoutes(
  label: string,
): Promise<BAToolsMissionRoute[] | null> {
  const cacheKey = `ba-tools:mission-routes:v2:${label}`;
  const cached = await getCached(cacheKey);
  if (cached !== null) {
    const routes = JSON.parse(cached);
    return routes === null ? null : z.array(MissionRouteSchema).parse(routes);
  }

  const response = await axios.get(
    `${BA_TOOLS_API_URL}/missions/${encodeURIComponent(label)}`,
    {
      timeout: 10_000,
      validateStatus: (status) => status === 200 || status === 404,
    },
  );

  if (response.status === 404) {
    await setCached(cacheKey, "null", NOT_FOUND_CACHE_TTL_SECONDS);
    return null;
  }

  const { routes } = MissionRoutesSchema.parse(response.data?.data);
  await setCached(cacheKey, JSON.stringify(routes), CACHE_TTL_SECONDS);

  return routes;
}

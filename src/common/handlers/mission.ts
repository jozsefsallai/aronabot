import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import type {
  MissionDrop,
  MissionRewardTag,
  MissionWithDrops,
} from "../../db/campaign-missions";
import { findActiveByType as findActiveBonusCampaign } from "../../db/bonus-campaigns";
import { findByLabel as findMissionByLabel } from "../../db/campaign-missions";
import type { BonusCampaign } from "../../db/client";
import type {
  BAToolsMissionRoute,
  BAToolsRouteEnemyAction,
  BAToolsRoutePlayerAction,
  MissionRouteKind,
} from "../../utils/clients/ba-tools";

type BAToolsRouteEnemy = BAToolsRouteEnemyAction["enemy"];
import {
  fetchMissionRoutes,
  missionGuideUrl,
  missionMapImageUrl,
  missionRouteKinds,
} from "../../utils/clients/ba-tools";
import { t, type LocalizeKey } from "../../utils/localizeTable";

const routeKindLabels: Record<MissionRouteKind, string> = {
  fastest: "Fastest",
  withBox: "With Pyroxene box",
  allStars: "All stars",
};

const directionWords: Record<string, string> = {
  upRight: "up-right",
  right: "right",
  downRight: "down-right",
  downLeft: "down-left",
  left: "left",
  upLeft: "up-left",
};

function attackTypeLabel(attackType: string | null): string {
  if (!attackType) {
    return "Any";
  }

  return t(`attackType.${attackType}` as LocalizeKey);
}

function defenseTypeLabel(defenseType: string): string {
  return t(`defenseType.${defenseType}` as LocalizeKey);
}

function formatProbability(probability: number): string {
  return `${Number((probability * 100).toFixed(1))}%`;
}

function formatDrop(drop: MissionDrop): string {
  const amount = drop.amount > 1 ? ` ×${drop.amount}` : "";
  const chance =
    drop.probability < 1 ? ` (${formatProbability(drop.probability)})` : "";

  return `${drop.name}${amount}${chance}`;
}

function formatDrops(
  drops: MissionDrop[],
  tags: MissionRewardTag[],
): string | null {
  const lines = drops.filter((drop) => tags.includes(drop.tag)).map(formatDrop);
  if (lines.length === 0) {
    return null;
  }

  return lines.join("\n").slice(0, 1024);
}

function formatRouteSummary(route: BAToolsMissionRoute): string {
  const teams = route.teams
    .map(
      (team) =>
        `${typeColor(team.attackType)} **${team.team}**: ${attackTypeLabel(team.attackType)}`,
    )
    .join(", ");

  return `${formatRouteFooter(route)}\n${teams}`;
}

function formatRouteFooter(route: BAToolsMissionRoute): string {
  return [
    `${route.turnCount} turns`,
    `${route.battles} battles`,
    route.withdrawals > 0 ? `${route.withdrawals} withdrawals` : null,
    route.takesBox ? "takes the box" : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

function routeKindLabel(kind: string): string {
  return routeKindLabels[kind as MissionRouteKind] ?? kind;
}

function buildMissionResponse(
  { label, mission, drops }: MissionWithDrops,
  routes: BAToolsMissionRoute[] | null,
  bonusCampaign: BonusCampaign | null,
) {
  const guideUrl = missionGuideUrl(label);

  const embed = new EmbedBuilder()
    .setTitle(`${label}${mission.isReleasedGlobal ? "" : " (JP only)"}`)
    .setURL(guideUrl)
    .addFields(
      {
        name: "Cost",
        value: `${mission.cost} AP`,
        inline: true,
      },
      {
        name: "Difficulty",
        value: mission.difficulty,
        inline: true,
      },
      {
        name: "Terrain",
        value: t(`terrain.${mission.terrain}`),
        inline: true,
      },
      {
        name: "Rec. lvl",
        value: mission.recommendedLevel.toString(),
        inline: true,
      },
      {
        name: "Teams",
        value: mission.echelonCount.toString(),
        inline: true,
      },
      {
        name: "Star goals",
        value:
          [
            mission.starTurns ? `Clear in ${mission.starTurns} turns` : null,
            mission.starSRanks ? `${mission.starSRanks} S-rank battles` : null,
          ]
            .filter(Boolean)
            .join("\n") || "Unknown",
        inline: true,
      },
    );

  if (bonusCampaign) {
    embed.setDescription(
      `**${bonusCampaign.bonusMultiply}x drops** are active until <t:${Math.floor(
        bonusCampaign.endDate.getTime() / 1000,
      )}:f>!`,
    );
  }

  const regularDrops = formatDrops(drops, ["Default", "Rare"]);
  if (regularDrops) {
    embed.addFields({ name: "Drops", value: regularDrops });
  }

  const firstClear = formatDrops(drops, ["FirstClear"]);
  if (firstClear) {
    embed.addFields({ name: "First clear", value: firstClear });
  }

  for (const route of routes ?? []) {
    embed.addFields({
      name: `Route: ${routeKindLabel(route.kind)}`,
      value: formatRouteSummary(route),
    });
  }

  if (!routes?.length && mission.fastestTurns) {
    embed.addFields({
      name: "Fastest clear",
      value: `${mission.fastestTurns} turns`,
    });
  }

  embed.addFields({ name: "Animated guide", value: guideUrl });
  embed.setImage(missionMapImageUrl(label));

  return {
    content: "",
    embeds: [embed],
    components: buildMissionButtons(label, routes ?? [], null),
  };
}

function buildMissionButtons(
  label: string,
  routes: BAToolsMissionRoute[],
  current: string | null,
) {
  const buttons: ButtonBuilder[] = [];

  buttons.push(
    new ButtonBuilder()
      .setCustomId(`mission_${label}`)
      .setLabel("Mission Details")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(current === null),
  );

  for (const route of routes) {
    if (!missionRouteKinds.includes(route.kind as MissionRouteKind)) {
      continue;
    }

    buttons.push(
      new ButtonBuilder()
        .setCustomId(`mission_${label}:${route.kind}`)
        .setLabel(`${routeKindLabel(route.kind)} route`)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(route.kind === current),
    );
  }

  return buttons.length > 1
    ? [new ActionRowBuilder<ButtonBuilder>().addComponents(buttons)]
    : [];
}

export async function handleMissionCommand(input: string) {
  const mission = await findMissionByLabel(input);
  if (!mission) {
    return null;
  }

  const [routes, bonusCampaign] = await Promise.all([
    fetchMissionRoutes(mission.label).catch(() => null),
    findActiveBonusCampaign(
      mission.mission.difficulty === "Hard" ? "HardMission" : "NormalMission",
    ),
  ]);

  return buildMissionResponse(mission, routes, bonusCampaign);
}

export async function handleMissionRouteCommand(label: string, kind: string) {
  const routes = await fetchMissionRoutes(label);
  const route = routes?.find((route) => route.kind === kind);
  if (!routes || !route) {
    return null;
  }

  return {
    content: "",
    embeds: [buildMissionRouteEmbed(label, route, routes[0])],
    components: buildMissionButtons(label, routes, route.kind),
  };
}

const typeColors: Record<string, string> = {
  Explosion: "🟥",
  Pierce: "🟨",
  Mystic: "🟦",
  Sonic: "🟪",
  Chemical: "🟩",
  LightArmor: "🟥",
  HeavyArmor: "🟨",
  Unarmed: "🟦",
  ElasticArmor: "🟪",
  CompositeArmor: "🟩",
};

function typeColor(type: string | null): string {
  return (type && typeColors[type]) || "⬜";
}

function directionWord(direction: string | null | undefined): string {
  return direction ? (directionWords[direction] ?? direction) : "";
}

function teamName(
  team: string,
  attackTypes: Map<string, string | null>,
): string {
  return `${typeColor(attackTypes.get(team) ?? null)} **Team ${team}**`;
}

function enemyWord(enemy: BAToolsRouteEnemy, capitalized = false): string {
  const armor = enemy.defenseType ? defenseTypeLabel(enemy.defenseType) : "?";

  let article = "the";
  if (capitalized) {
    article = enemy.boss ? "The" : /^[AEIOU]/i.test(armor) ? "An" : "A";
  }

  return `${article} ${typeColor(enemy.defenseType)} **${armor} ${enemy.boss ? "boss" : "enemy"}**`;
}

function playerStep(
  action: BAToolsRoutePlayerAction,
  attackTypes: Map<string, string | null>,
): string {
  const team = teamName(action.team, attackTypes);
  const direction = directionWord(action.direction);

  switch (action.type) {
    case "move": {
      let text = action.attacks
        ? `${team} attacks ${enemyWord(action.attacks)} ${direction}`
        : `${team} moves ${direction}`;

      if (action.picksUpBox) {
        text += " and picks up the 💎 Pyroxene box";
      }

      if (action.togglesSwitch) {
        text += " and steps on the switch";
      }

      return text;
    }
    case "swap":
      return `${team} swaps places with ${teamName(action.otherTeam ?? "?", attackTypes)}`;
    case "teleport":
      return action.attacks
        ? `${team} teleports through the portal and attacks ${enemyWord(action.attacks)} on the other side`
        : `${team} teleports through the portal`;
    case "evacuate":
      return `${team} is moved to a start tile as its tile disappears`;
    case "withdraw":
      return `${team} attacks ${action.attacks ? enemyWord(action.attacks) : "the enemy"} ${direction} and withdraws from the battle`;
    default:
      return `${team} ${action.type}`;
  }
}

function enemyStep(
  action: BAToolsRouteEnemyAction,
  attackTypes: Map<string, string | null>,
): string {
  const subject = enemyWord(action.enemy, true);

  if (action.type !== "attack" || !action.team) {
    return `${subject} moves ${directionWord(action.direction)}`;
  }

  return `${subject} attacks ${teamName(action.team, attackTypes)}${
    action.teamWithdraws ? ", which withdraws from the battle" : ""
  }`;
}

function teamBattles(battles: BAToolsMissionRoute["teams"][number]["battles"]) {
  const groups: {
    defenseType: string | null;
    boss: boolean;
    withdrawn: boolean;
    count: number;
  }[] = [];

  for (const battle of battles) {
    const group = groups.find(
      (g) =>
        g.defenseType === battle.defenseType &&
        g.boss === battle.boss &&
        g.withdrawn === battle.withdrawn,
    );

    if (group) {
      group.count += 1;
    } else {
      groups.push({ ...battle, count: 1 });
    }
  }

  return groups
    .map((g) => {
      const armor = `${typeColor(g.defenseType)} ${
        g.defenseType ? defenseTypeLabel(g.defenseType) : "?"
      }`;
      const count = g.count > 1 ? ` ×${g.count}` : "";

      if (g.withdrawn) {
        return `${armor}${count} (withdraws)`;
      }

      return g.boss ? `${armor} boss` : `${armor}${count}`;
    })
    .join(", ");
}

function sameDeployment(a: BAToolsMissionRoute, b: BAToolsMissionRoute) {
  return (
    a.teams.length === b.teams.length &&
    a.teams.every(
      (team, i) =>
        team.start.x === b.teams[i].start.x &&
        team.start.y === b.teams[i].start.y &&
        team.attackType === b.teams[i].attackType,
    )
  );
}

function buildMissionRouteEmbed(
  label: string,
  route: BAToolsMissionRoute,
  mapRoute: BAToolsMissionRoute,
): EmbedBuilder {
  const guideUrl = missionGuideUrl(label);
  const attackTypes = new Map(
    route.teams.map((team) => [team.team, team.attackType]),
  );

  const lines: string[] = [];

  for (const team of route.teams) {
    lines.push(
      team.battles.length > 0
        ? `${teamName(team.team, attackTypes)} · ${attackTypeLabel(team.attackType)}\n-# Battles: ${teamBattles(team.battles)}`
        : `${teamName(team.team, attackTypes)} · No battles`,
    );
  }

  const mapShowsDeployment = sameDeployment(route, mapRoute);
  const tiles = route.teams.length === 1 ? "tile" : "tiles";

  lines.push(
    mapShowsDeployment
      ? `\n**Start:** Deploy ${route.teams.length === 1 ? "Team A" : "the teams"} on the start ${tiles} marked on the map below.`
      : `\n**Start:** This route deploys differently from the map below. See the [animated guide](${guideUrl}) for the start ${tiles}.`,
  );

  for (const turn of route.turns) {
    const steps: string[] = [
      ...turn.start.evacuations.map((a) => playerStep(a, attackTypes)),
    ];

    if (turn.player.length === 0) {
      steps.push("End the turn without moving");
    }

    steps.push(...turn.player.map((a) => playerStep(a, attackTypes)));

    const shownEnemies = turn.enemy.filter(
      (action) => action.type === "attack" || action.enemy.boss,
    );
    const enemySteps = [
      ...shownEnemies.map((a) => enemyStep(a, attackTypes)),
      ...turn.evacuations.map((a) => playerStep(a, attackTypes)),
    ];

    lines.push(`\n__**Turn ${turn.turn}**__`);
    lines.push(...steps.map((step, i) => `${i + 1}. ${step}`));

    if (enemySteps.length > 0) {
      lines.push(...enemySteps.map((step) => `-# ↳ ${step}`));
    }
  }

  lines.push(
    `\n✅ Mission cleared in ${route.turnCount} ${route.turnCount === 1 ? "turn" : "turns"}.`,
  );

  let description = lines.join("\n");
  if (description.length > 4096) {
    description = `${description.slice(0, 4000)}\n…\nSee the full route at ${guideUrl}`;
  }

  return new EmbedBuilder()
    .setTitle(`${label}: ${routeKindLabel(route.kind)} route`)
    .setURL(guideUrl)
    .setDescription(description)
    .setImage(missionMapImageUrl(label))
    .setFooter({ text: formatRouteFooter(route) });
}

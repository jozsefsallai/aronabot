import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  type SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import { staffOnlyGuard } from "../../core/guards/staffOnly";
import type { CommandContext } from "../../core/handler/CommandHandler";
import {
  findAll as findAllBanners,
  findById as findBannerById,
} from "../../db/banners";
import type { AutocompleteContext } from "../../core/handler/AutocompleteHandler";
import type { BannerCounterKind } from "../../db/client";
import { gacha } from "../../gacha";

async function getBannerChoices() {
  return (await findAllBanners()).slice(0, 25).map((banner) => {
    return {
      name: banner.name,
      value: banner.id,
    };
  });
}

export const meta: SlashCommandOptionsOnlyBuilder = new SlashCommandBuilder()
  .setName("simulate-gacha")
  .setDescription("[STAFF] Simulate gacha pulls to audit rates.")
  .setDefaultPermission(false)
  .addStringOption((option) => {
    return option
      .setName("banner")
      .setDescription("The banner to simulate.")
      .setRequired(true)
      .setAutocomplete(true);
  })
  .addIntegerOption((option) => {
    return option.setName("count").setDescription("The number of simulations.");
  })
  .addIntegerOption((option) => {
    return option
      .setName("pulls-per-simulation")
      .setDescription("The number of pulls per simulation.");
  })
  .addStringOption((option) => {
    return option
      .setName("counter-kind")
      .setDescription(
        "The kind of counter to use. By default, it will use the banner's counter kind.",
      )
      .setChoices(
        {
          name: "Recruitment Points",
          value: "Points",
        },
        {
          name: "Recruitment Charge",
          value: "Charge",
        },
      )
      .setRequired(false);
  });

export const autocomplete = async (ctx: AutocompleteContext) => {
  await ctx.interaction.respond(await getBannerChoices());
};

export const handler: (
  ctx: CommandContext<ChatInputCommandInteraction>,
) => Promise<void> = staffOnlyGuard(async (ctx) => {
  await ctx.interaction.deferReply({ ephemeral: true });

  let bannerName = ctx.interaction.options.get("banner")?.value as
    | string
    | undefined;

  if (!bannerName) {
    bannerName = "regular";
  }

  let count = ctx.interaction.options.get("count")?.value as number | undefined;
  let pullsPerSimulation = ctx.interaction.options.get("pulls-per-simulation")
    ?.value as number | undefined;

  if (!count) {
    count = 10;
  }

  if (!pullsPerSimulation) {
    pullsPerSimulation = 1000;
  }

  if (pullsPerSimulation % 10 !== 0) {
    await ctx.interaction.editReply(
      "Pulls per simulation must be a multiple of 10.",
    );
    return;
  }

  const banner = await findBannerById(bannerName);
  if (!banner) {
    await ctx.interaction.editReply("Banner not found!");
    return;
  }

  let counterKind = ctx.interaction.options.get("counter-kind")?.value as
    | BannerCounterKind
    | undefined;
  if (!counterKind) {
    counterKind = banner.counterKind;
  }

  const results = [];

  for (let i = 0; i < count; ++i) {
    let oneStarCount = 0;
    let twoStarCount = 0;
    let threeStarCount = 0;

    let pickupCount = 0;
    let extraCount = 0;
    let additionalThreeStarCount = 0;

    let pointsOrCharge = 0;

    try {
      for (let j = 0; j < pullsPerSimulation; j += 10) {
        const { students, counter } = await gacha({
          banner,
          userId: ctx.interaction.user.id,
          guildId: ctx.interaction.guildId ?? "0",
          dryRun: true,
          counterOverride: pointsOrCharge,
          counterKindOverride: counterKind,
        });

        pointsOrCharge = counter;

        for (const [student, _] of students) {
          if (student.rarity === 1) {
            oneStarCount++;
          } else if (student.rarity === 2) {
            twoStarCount++;
          } else if (student.rarity === 3) {
            threeStarCount++;
          }

          if (banner.isPickup(student.id)) {
            pickupCount++;
          }

          if (banner.isExtra(student.id)) {
            extraCount++;
          }

          if (banner.isAdditionalThreeStar(student.id)) {
            additionalThreeStarCount++;
          }
        }
      }
    } catch (err: any) {
      await ctx.interaction.editReply(err.message);
      return;
    }

    const pickupCountWithSpark =
      counterKind === "Points"
        ? pickupCount + Math.floor(pullsPerSimulation / 200)
        : null;

    const oneStarRate = oneStarCount / pullsPerSimulation;
    const twoStarRate = twoStarCount / pullsPerSimulation;
    const threeStarRate = threeStarCount / pullsPerSimulation;

    const pickupRate = pickupCount / pullsPerSimulation;
    const pickupRateWithSpark =
      counterKind === "Points"
        ? (pickupCountWithSpark ?? 0) / pullsPerSimulation
        : null;
    const extraRate = extraCount / pullsPerSimulation;
    const additionalThreeStarRate =
      additionalThreeStarCount / pullsPerSimulation;

    results.push({
      oneStarCount,
      twoStarCount,
      threeStarCount,
      pickupCount,
      pickupCountWithSpark,
      extraCount,
      additionalThreeStarCount,

      oneStarRate,
      twoStarRate,
      threeStarRate,
      pickupRate,
      pickupRateWithSpark,
      extraRate,
      additionalThreeStarRate,
    });
  }

  const summary = {
    oneStarCount: 0,
    twoStarCount: 0,
    threeStarCount: 0,
    pickupCount: 0,
    pickupCountWithSpark: 0,
    extraCount: 0,
    additionalThreeStarCount: 0,

    oneStarRate: 0,
    twoStarRate: 0,
    threeStarRate: 0,
    pickupRate: 0,
    pickupRateWithSpark: 0,
    extraRate: 0,
    additionalThreeStarRate: 0,
  };

  for (const result of results) {
    summary.oneStarCount += result.oneStarCount;
    summary.twoStarCount += result.twoStarCount;
    summary.threeStarCount += result.threeStarCount;
    summary.pickupCount += result.pickupCount;
    summary.extraCount += result.extraCount;
    summary.additionalThreeStarCount += result.additionalThreeStarCount;

    if (typeof result.pickupCountWithSpark === "number") {
      summary.pickupCountWithSpark += result.pickupCountWithSpark;
    }
  }

  summary.oneStarRate = summary.oneStarCount / (pullsPerSimulation * count);
  summary.twoStarRate = summary.twoStarCount / (pullsPerSimulation * count);
  summary.threeStarRate = summary.threeStarCount / (pullsPerSimulation * count);
  summary.pickupRate = summary.pickupCount / (pullsPerSimulation * count);
  summary.pickupRateWithSpark =
    summary.pickupCountWithSpark / (pullsPerSimulation * count);
  summary.extraRate = summary.extraCount / (pullsPerSimulation * count);
  summary.additionalThreeStarRate =
    summary.additionalThreeStarCount / (pullsPerSimulation * count);

  const json = JSON.stringify(
    {
      bannerName,
      count,
      pullsPerSimulation,
      results,
      summary,
    },
    null,
    2,
  );

  const file = Buffer.from(json, "utf-8");
  await ctx.interaction.editReply({
    files: [
      {
        attachment: file,
        name: "gacha_simulation.json",
      },
    ],
  });
});

import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  type SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import { staffOnlyGuard } from "../../core/guards/staffOnly";
import type { CommandContext } from "../../core/handler/CommandHandler";
import recruitmentPointsManager from "../../gacha/points";
import gachaPullsManager from "../../gacha/pulls";
import type { BannerKind } from "../../db/client";

export const meta: SlashCommandOptionsOnlyBuilder = new SlashCommandBuilder()
  .setName("rrp")
  .setDescription("[STAFF] Reset recruitment points.")
  .setDefaultPermission(false)
  .addStringOption((option) => {
    return option
      .setName("region")
      .setDescription("The game region to reset recruitment points for.")
      .addChoices(
        {
          name: "Global",
          value: "Global",
        },
        {
          name: "JP",
          value: "JP",
        },
      );
  });

export const handler: (
  ctx: CommandContext<ChatInputCommandInteraction>,
) => Promise<void> = staffOnlyGuard(async (ctx) => {
  await ctx.interaction.deferReply({ ephemeral: true });

  let bannerKind = ctx.interaction.options.get("region")?.value as
    | BannerKind
    | undefined;

  if (!bannerKind) {
    bannerKind = "Global";
  }

  const [pointsResult, pullsResult] = await Promise.all([
    recruitmentPointsManager.resetAll(bannerKind),
    gachaPullsManager.resetAll(bannerKind),
  ]);
  if (!pointsResult || !pullsResult) {
    await ctx.interaction.editReply(
      "Failed to reset recruitment points and total pulls. Was the Redis connection established?",
    );
  } else {
    await ctx.interaction.editReply(
      `Recruitment points and total pulls reset for ${bannerKind}.`,
    );
  }
});

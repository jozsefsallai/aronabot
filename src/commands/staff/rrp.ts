import { SlashCommandBuilder } from "discord.js";
import { staffOnlyGuard } from "../../core/guards/staffOnly";
import type { CommandContext } from "../../core/handler/CommandHandler";
import recruitmentPointsManager from "../../gacha/points";
import type { BannerKind } from "@prisma/client";

export const meta = new SlashCommandBuilder()
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

export const handler = staffOnlyGuard(async (ctx: CommandContext) => {
  await ctx.interaction.deferReply({ ephemeral: true });

  let bannerKind = ctx.interaction.options.get("region")?.value as
    | BannerKind
    | undefined;

  if (!bannerKind) {
    bannerKind = "Global";
  }

  const result = await recruitmentPointsManager.resetAll(bannerKind);
  if (!result) {
    await ctx.interaction.editReply(
      "Failed to reset recruitment points. Was the Redis connection established?",
    );
  } else {
    await ctx.interaction.editReply(
      `Recruitment points reset for ${bannerKind}.`,
    );
  }
});

import { EmbedBuilder } from "discord.js";
import type { CommandContext } from "../../core/handler/CommandHandler";
import recruitmentPointsManager from "../../gacha/points";
import { GAME_BLUE, GAME_RED } from "../../utils/constants";
import {
  AppIntegrationType,
  SlashCommandBuilder,
} from "../../utils/slashCommandBuilder";
import type { BannerKind } from "../../db/client";

export const meta = new SlashCommandBuilder()
  .setName("spark")
  .setDescription("Use 200 recruitment points on a game region.")
  .setIntegrationTypes(
    AppIntegrationType.GuildInstall,
    AppIntegrationType.UserInstall,
  )
  .addStringOption((option) => {
    return option
      .setName("region")
      .setDescription("The game region to reset.")
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

export const handler = async (ctx: CommandContext) => {
  await ctx.interaction.deferReply();

  let bannerKind = ctx.interaction.options.get("region")?.value as
    | BannerKind
    | undefined;

  if (!bannerKind) {
    bannerKind = "Global";
  }

  const guildId = ctx.interaction.guildId ?? "0";
  const userId = ctx.interaction.user.id;

  const currentAmount = await recruitmentPointsManager.get(
    bannerKind,
    guildId,
    userId,
  );

  if (!currentAmount || currentAmount < 200) {
    const embed = new EmbedBuilder()
      .setTitle("Recruitment Points Reset")
      .setDescription(
        `You may not use this command until you have at least 200 recruitment points on **${bannerKind}**.`,
      )
      .setColor(GAME_RED.toArray());

    await ctx.interaction.editReply({
      embeds: [embed],
    });

    return;
  }

  await recruitmentPointsManager.set(
    bannerKind,
    guildId,
    userId,
    currentAmount - 200,
  );

  const embed = new EmbedBuilder()
    .setTitle("Recruitment Points Reset")
    .setDescription(`Used 200 of your recruitment points on **${bannerKind}**.`)
    .setColor(GAME_BLUE.toArray());

  await ctx.interaction.editReply({
    embeds: [embed],
  });
};

import type { CommandContext } from "../../core/handler/CommandHandler";

import {
  findAll as findAllBanners,
  findById as findBannerById,
} from "../../db/banners";
import type { AutocompleteContext } from "../../core/handler/AutocompleteHandler";
import {
  AppIntegrationType,
  SlashCommandBuilder,
} from "../../utils/slashCommandBuilder";
import {
  InteractionContextType,
  type ChatInputCommandInteraction,
  type SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import { createGachaResponse } from "../../gacha/response";

async function getBannerChoices() {
  return (await findAllBanners()).slice(0, 25).map((banner) => {
    return {
      name: banner.name,
      value: banner.id,
    };
  });
}

export const meta: SlashCommandOptionsOnlyBuilder = new SlashCommandBuilder()
  .setName("gacha")
  .setDescription("Roll on the current banners.")
  .setIntegrationTypes(
    AppIntegrationType.GuildInstall,
    AppIntegrationType.UserInstall,
  )
  .setContexts(
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel,
    InteractionContextType.Guild,
  )
  .addStringOption((option) => {
    return option
      .setName("banner")
      .setDescription("The banner to pull on.")
      .setRequired(true)
      .setAutocomplete(true);
  });

export const autocomplete = async (ctx: AutocompleteContext) => {
  await ctx.interaction.respond(await getBannerChoices());
};

export const handler = async (
  ctx: CommandContext<ChatInputCommandInteraction>,
) => {
  await ctx.interaction.deferReply();

  let bannerName = ctx.interaction.options.get("banner")?.value as
    | string
    | undefined;

  if (!bannerName) {
    bannerName = "regular";
  }

  const guildId = ctx.interaction.guildId ?? "0";
  const userId = ctx.interaction.user.id;

  const banner = await findBannerById(bannerName);

  if (!banner) {
    await ctx.interaction.editReply("Invalid banner.");
    return;
  }

  try {
    await ctx.interaction.editReply(
      await createGachaResponse(banner, userId, guildId),
    );
  } catch (err: any) {
    await ctx.interaction.editReply(err.message);
  }
};

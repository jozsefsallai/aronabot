import {
  type ChatInputCommandInteraction,
  type SlashCommandOptionsOnlyBuilder,
  InteractionContextType,
} from "discord.js";
import type { CommandContext } from "../../core/handler/CommandHandler";
import { handleMissionCommand } from "../../common/handlers/mission";
import {
  AppIntegrationType,
  SlashCommandBuilder,
} from "../../utils/slashCommandBuilder";

export const meta: SlashCommandOptionsOnlyBuilder = new SlashCommandBuilder()
  .setName("mission")
  .setDescription("Get information, routes and map preview about a mission.")
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
      .setName("name")
      .setDescription("The name of the mission (e.g. 1-1, 25-3H).")
      .setRequired(true);
  });

export const handler = async (
  ctx: CommandContext<ChatInputCommandInteraction>,
) => {
  await ctx.interaction.deferReply();

  const name = ctx.interaction.options.get("name")?.value as string;

  const response = await handleMissionCommand(name);

  if (!response) {
    await ctx.interaction.editReply({
      content: `Could not find mission "${name}".`,
    });

    return;
  }

  await ctx.interaction.editReply(response);
};

import { SlashCommandBuilder } from "discord.js";
import { staffOnlyGuard } from "../../core/guards/staffOnly";
import type { CommandContext } from "../../core/handler/CommandHandler";
import { reloadContainers } from "../../containers/utils/reload";

export const meta = new SlashCommandBuilder()
  .setName("reload")
  .setDescription("[STAFF] Reload containers.")
  .setDefaultPermission(false);

export const handler = staffOnlyGuard(async (ctx: CommandContext) => {
  await ctx.interaction.deferReply({ ephemeral: true });
  await reloadContainers();
  await ctx.interaction.editReply("Containers reloaded.");
});

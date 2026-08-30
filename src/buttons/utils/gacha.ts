import { findById as findBannerById } from "../../db/banners";
import { createGachaResponse } from "../../gacha/response";
import type { ButtonContext } from "../../core/handler/ButtonHandler";
import { Routes } from "discord.js";

export const meta = {
  id: "gacha",
};

export const handler = async (ctx: ButtonContext) => {
  const parts = ctx.uniqueId?.split("_") ?? [];
  const userId = parts.shift();
  const bannerId = parts.join("_");

  if (!userId || userId !== ctx.interaction.user.id) {
    await ctx.interaction.reply({
      content: "You cannot use this button.",
      ephemeral: true,
    });
    return;
  }

  if (!bannerId) {
    await ctx.interaction.reply("Button has no banner ID.");
    return;
  }

  await ctx.interaction.deferReply();

  try {
    await ctx.interaction.client.rest.patch(
      Routes.channelMessage(
        ctx.interaction.channelId,
        ctx.interaction.message.id,
      ),
      { body: { components: [] } },
    );
  } catch (err) {
    console.error("Failed to remove gacha buttons:", err);
  }

  const banner = await findBannerById(bannerId);
  if (!banner) {
    await ctx.interaction.editReply("Invalid banner.");
    return;
  }

  try {
    const response = await createGachaResponse(
      banner,
      userId,
      ctx.interaction.guildId ?? "0",
    );
    await ctx.interaction.editReply(response);
  } catch (err: any) {
    await ctx.interaction.editReply(err.message);
  }
};

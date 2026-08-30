import { findById as findBannerById } from "../../db/banners";
import { createGachaResponse } from "../../gacha/response";
import type { ButtonContext } from "../../core/handler/ButtonHandler";

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
  await ctx.interaction.message.edit({ components: [] });

  const banner = await findBannerById(bannerId);
  if (!banner) {
    await ctx.interaction.editReply("Invalid banner.");
    return;
  }

  try {
    await ctx.interaction.editReply(
      await createGachaResponse(banner, userId, ctx.interaction.guildId ?? "0"),
    );
  } catch (err: any) {
    await ctx.interaction.editReply(err.message);
  }
};

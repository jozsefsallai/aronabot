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
import type { CardProps } from "../../gacha/components/card";
import { generateGachaResult } from "../../gacha/generate-result";
import {
  EmbedBuilder,
  InteractionContextType,
  type ChatInputCommandInteraction,
  type SlashCommandOptionsOnlyBuilder,
} from "discord.js";
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

  const cards: CardProps[] = [];

  let pointsOrCharge: number | undefined;

  try {
    const { students, counter } = await gacha({
      banner,
      userId,
      guildId,
      dryRun: false,
    });

    pointsOrCharge = counter;

    for (const [student, key] of students) {
      cards.push({
        student,
        isPickup: banner.isPickup(key),
      });
    }
  } catch (err: any) {
    await ctx.interaction.editReply(err.message);
    return;
  }

  try {
    const png = await generateGachaResult({
      cards,
      type: banner.counterKind,
      points: pointsOrCharge,
      charge: pointsOrCharge,
      pickupStudent: banner.pickupStudents[0],
    });

    await ctx.interaction.editReply({
      files: [
        {
          attachment: png,
          name: "gacha_result.png",
        },
      ],
    });
  } catch (err: any) {
    const students = cards.map((card) => card.student.name).join(", ");
    const embed = new EmbedBuilder()
      .setTitle("Error")
      .setDescription(
        `An unexpected error occurred and the gacha result image couldn't be rendered. You rolled the following students:\n\`\`\`\n${students}\`\`\``,
      )
      .setColor(0xff0000);

    await ctx.interaction.editReply({
      embeds: [embed],
    });
  }
};

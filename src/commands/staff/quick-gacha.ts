import {
  EmbedBuilder,
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
import type { CardProps } from "../../gacha/components/card";
import { generateGachaResult } from "../../gacha/generate-result";
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
  .setName("quick-gacha")
  .setDescription("[STAFF] Quick gacha.")
  .setDefaultPermission(false)
  .addStringOption((option) => {
    return option
      .setName("banner")
      .setDescription("The banner to simulate.")
      .setRequired(true)
      .setAutocomplete(true);
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

  const banner = await findBannerById(bannerName);

  if (!banner) {
    await ctx.interaction.editReply("Invalid banner.");
    return;
  }

  const cards: CardProps[] = [];
  let gotRateUp = false;
  let pointsOrCharge = 0;

  while (!gotRateUp) {
    try {
      const { students, counter } = await gacha({
        banner,
        userId: ctx.interaction.user.id,
        guildId: ctx.interaction.guildId ?? "0",
        dryRun: true,
        counterOverride: pointsOrCharge,
      });

      pointsOrCharge = counter;
      gotRateUp = students.some((student) => banner.isPickup(student[1]));

      if (gotRateUp) {
        for (const [student, icon] of students) {
          cards.push({
            student,
            isPickup: banner.isPickup(icon),
          });
        }
      }

      if (banner.counterKind === "Points" && pointsOrCharge >= 2000) {
        await ctx.interaction.editReply(
          "Reached 2000 points without pulling a rate-up student. Stopping simulation.",
        );
        return;
      }
    } catch (err) {
      await ctx.interaction.editReply("Failed to pull 10 students...");
      return;
    }
  }

  try {
    const png = await generateGachaResult({
      cards,
      type: banner.counterKind,
      points: pointsOrCharge,
      charge: pointsOrCharge,
      pickupStudent: banner.pickupStudents[0],
      bannerChargeCategory: banner.chargeCategory,
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
});

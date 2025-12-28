import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { staffOnlyGuard } from "../../core/guards/staffOnly";
import type { CommandContext } from "../../core/handler/CommandHandler";
import { bannerContainer } from "../../containers/banners";
import type { AutocompleteContext } from "../../core/handler/AutocompleteHandler";
import type { CardProps } from "../../gacha/components/card";
import { generateGachaResult } from "../../gacha/generate-result";

function getBannerChoices() {
  return bannerContainer
    .all()
    .slice(0, 25)
    .map((banner) => {
      return {
        name: banner.name,
        value: banner.id,
      };
    });
}

export const meta = new SlashCommandBuilder()
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
  await ctx.interaction.respond(getBannerChoices());
};

export const handler = staffOnlyGuard(async (ctx: CommandContext) => {
  await ctx.interaction.deferReply({ ephemeral: true });

  let bannerName = ctx.interaction.options.get("banner")?.value as
    | string
    | undefined;

  if (!bannerName) {
    bannerName = "regular";
  }

  const banner = bannerContainer.getBanner(bannerName);

  if (!banner) {
    await ctx.interaction.editReply("Invalid banner.");
    return;
  }

  const cards: CardProps[] = [];
  let gotRateUp = false;
  let points = 0;

  while (!gotRateUp) {
    try {
      points += 10;

      const students = banner.pullTen();
      gotRateUp = students.some((student) => banner.isPickup(student[1]));

      if (gotRateUp) {
        for (const [student, icon] of students) {
          cards.push({
            student,
            isPickup: banner.isPickup(icon),
          });
        }
      }

      if (points >= 2000) {
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
      points,
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

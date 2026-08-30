import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import type { GachaBanner } from "./banner";
import type { CardProps } from "./components/card";
import { generateGachaResult } from "./generate-result";
import { gacha } from "./index";

export async function createGachaResponse(
  banner: GachaBanner,
  userId: string,
  guildId: string,
  includeButtons = true,
) {
  const cards: CardProps[] = [];
  const { students, counter, totalPulls } = await gacha({
    banner,
    userId,
    guildId,
    dryRun: false,
  });

  for (const [student, key] of students) {
    cards.push({
      student,
      isPickup: banner.isPickup(key),
    });
  }

  let png: Buffer;
  try {
    png = await generateGachaResult({
      cards,
      type: banner.counterKind,
      points: counter,
      charge: counter,
      pickupStudent: banner.pickupStudents[0],
      bannerChargeCategory: banner.chargeCategory,
    });
  } catch {
    const students = cards.map((card) => card.student.name).join(", ");
    const embed = new EmbedBuilder()
      .setTitle("Error")
      .setDescription(
        `An unexpected error occurred and the gacha result image couldn't be rendered. You rolled the following students:\n\`\`\`\n${students}\`\`\``,
      )
      .setColor(0xff0000);

    return { content: `<@${userId}>`, embeds: [embed] };
  }

  const components = includeButtons
    ? [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("gacha_total_pulls")
            .setLabel(`Total pulls: ${totalPulls}`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId(`gacha_${userId}_${banner.id}`)
            .setLabel("Pull 10x again")
            .setStyle(ButtonStyle.Primary),
        ),
      ]
    : [];

  return {
    content: `<@${userId}>`,
    files: [{ attachment: png, name: "gacha_result.png" }],
    components,
  };
}

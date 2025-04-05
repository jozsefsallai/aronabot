import { EmbedBuilder } from "discord.js";
import type { AutocompleteContext } from "../../core/handler/AutocompleteHandler";
import { giftContainer } from "../../containers/gifts";
import { StudentContainer, studentContainer } from "../../containers/students";
import type { CommandContext } from "../../core/handler/CommandHandler";
import {
  AppIntegrationType,
  SlashCommandBuilder,
} from "../../utils/slashCommandBuilder";
import { getPortraitUrl } from "../../utils/student-utils";
import { getGiftIcon } from "../../utils/gift-utils";

enum Params {
  GIFT = "gift",
  STUDENT = "student",
}

export const meta = new SlashCommandBuilder()
  .setName("gifts")
  .setDescription(
    "Get information about a gift or the gifts liked by a student.",
  )
  .setIntegrationTypes(
    AppIntegrationType.GuildInstall,
    AppIntegrationType.UserInstall,
  )
  .addStringOption((option) => {
    return option
      .setName(Params.GIFT)
      .setDescription("The name of the gift.")
      .setRequired(false)
      .setAutocomplete(true);
  })
  .addStringOption((option) => {
    return option
      .setName(Params.STUDENT)
      .setDescription("The name of the student.")
      .setRequired(false)
      .setAutocomplete(true);
  });

export const autocomplete = async (ctx: AutocompleteContext) => {
  const focusedValue = ctx.interaction.options.getFocused(true);

  if (focusedValue.value.length < 2) {
    await ctx.interaction.respond([]);
    return;
  }

  if (focusedValue.name === Params.GIFT) {
    const gifts = giftContainer.findManyByName(focusedValue.value);
    await ctx.interaction.respond(
      gifts.slice(0, 25).map((gift) => {
        return {
          name: gift.name,
          value: gift.name,
        };
      }),
    );
    return;
  }

  if (focusedValue.name === Params.STUDENT) {
    const students = studentContainer.findManyByName(focusedValue.value);
    await ctx.interaction.respond(
      students
        .sort(StudentContainer.sortBySimilarity(focusedValue.value))
        .slice(0, 25)
        .map((student) => {
          return {
            name: student.name,
            value: student.name,
          };
        }),
    );
    return;
  }

  await ctx.interaction.respond([]);
};

export const handler = async (ctx: CommandContext) => {
  await ctx.interaction.deferReply();

  const gift = ctx.interaction.options.get(Params.GIFT)?.value as
    | string
    | undefined;
  const student = ctx.interaction.options.get(Params.STUDENT)?.value as
    | string
    | undefined;

  if (!gift && !student) {
    await ctx.interaction.editReply({
      content: "You need to specify a gift or a student.",
    });
    return;
  }

  if (gift && student) {
    await ctx.interaction.editReply({
      content: "You can only specify a gift or a student, not both.",
    });
    return;
  }

  if (gift) {
    await handleGift(ctx, gift);
    return;
  }

  if (student) {
    await handleStudent(ctx, student);
    return;
  }
};

const handleGift = async (ctx: CommandContext, gift: string) => {
  const giftData = giftContainer.getGiftWithName(gift);
  if (!giftData) {
    await ctx.interaction.editReply({
      content: `Could not find a gift with the name "${gift}".`,
    });
    return;
  }

  const embed = new EmbedBuilder().setTitle(giftData.name);

  if (giftData.description) {
    embed.setDescription(giftData.description);
  }

  const iconUrl = getGiftIcon(giftData);
  embed.setThumbnail(iconUrl);

  embed.addFields({ name: "Rarity", value: giftData.rarity });

  const adoredExp = 4 * giftData.expValue;
  const lovedExp = 3 * giftData.expValue;
  const likedExp = 2 * giftData.expValue;

  if (giftData.adoredBy.length > 0) {
    const studentsString = giftData.adoredBy
      .map((student) => student.name)
      .join("\n- ");

    embed.addFields({
      name: `Adored by (${adoredExp} EXP):`,
      value: `- ${studentsString}`,
      inline: true,
    });
  }

  if (giftData.lovedBy.length > 0) {
    const studentsString = giftData.lovedBy
      .map((student) => student.name)
      .join("\n- ");
    embed.addFields({
      name: `Loved by (${lovedExp} EXP):`,
      value: `- ${studentsString}`,
      inline: true,
    });
  }

  if (giftData.likedBy.length > 0) {
    const studentsString = giftData.likedBy
      .map((student) => student.name)
      .join("\n- ");
    embed.addFields({
      name: `Liked by (${likedExp} EXP):`,
      value: `- ${studentsString}`,
      inline: true,
    });
  }

  await ctx.interaction.editReply({ embeds: [embed] });
};

const handleStudent = async (ctx: CommandContext, student: string) => {
  const studentData = studentContainer.getByName(student);
  if (!studentData) {
    await ctx.interaction.editReply({
      content: `Could not find student "${student}".`,
    });
    return;
  }

  const embed = new EmbedBuilder().setTitle(studentData.name);

  const portraitUrl = getPortraitUrl(studentData);
  embed.setThumbnail(portraitUrl);

  if (studentData.giftsAdored.length > 0) {
    const giftsString = studentData.giftsAdored
      .map((gift) => gift.name)
      .join("\n- ");
    embed.addFields({
      name: "Adored Gifts",
      value: `- ${giftsString}`,
      inline: true,
    });
  }

  if (studentData.giftsLoved.length > 0) {
    const giftsString = studentData.giftsLoved
      .map((gift) => gift.name)
      .join("\n- ");
    embed.addFields({
      name: "Loved Gifts",
      value: `- ${giftsString}`,
      inline: true,
    });
  }

  if (studentData.giftsLiked.length > 0) {
    const giftsString = studentData.giftsLiked
      .map((gift) => gift.name)
      .join("\n- ");
    embed.addFields({
      name: "Liked Gifts",
      value: `- ${giftsString}`,
      inline: true,
    });
  }

  await ctx.interaction.editReply({ embeds: [embed] });
};

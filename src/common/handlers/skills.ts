import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from 'discord.js';
import { ButtonContext } from '../../core/handler/ButtonHandler';
import { CommandContext } from '../../core/handler/CommandHandler';
import { Student } from '../../models/Student';

export const handleStudentSkillsCommand = async (
  student: Student,
  ctx: CommandContext | ButtonContext,
) => {
  if (!student.skills) {
    await ctx.interaction.editReply({
      content: `${student.name} currently does not have skill data.`,
    });

    return;
  }

  let embed = new EmbedBuilder()
    .setTitle(`${student.name} Skills`)
    .setURL(student.schaledbUrl);

  if (student.wikiImage) {
    embed = embed.setThumbnail(student.wikiImage);
  }

  for (const skill of student.skills) {
    embed = embed.addFields({
      name: `${skill.kind.name}: ${skill.title}`,
      value: '> ' + skill.description.replace(/\n/g, '\n> '),
    });
  }

  const studentButton = new ButtonBuilder()
    .setCustomId(`student_${student.key}`)
    .setLabel('Student Details')
    .setStyle(ButtonStyle.Primary);

  const componentRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    studentButton,
  );

  await ctx.interaction.editReply({
    embeds: [embed],
    components: [componentRow],
  });
};

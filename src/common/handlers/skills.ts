import {
  ActionRowBuilder,
  BaseMessageOptions,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from 'discord.js';
import { Student } from '../../models/Student';

export const handleStudentSkillsCommand = async (
  student: Student,
): Promise<BaseMessageOptions> => {
  if (!student.skills || student.skills.length === 0) {
    return {
      content: `${student.name} currently does not have skill data.`,
    };
  }

  let embed = new EmbedBuilder()
    .setTitle(`${student.name} Skills`)
    .setURL(student.schaledbUrl);

  if (student.portraitUrl) {
    embed = embed.setThumbnail(student.portraitUrl);
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

  return {
    embeds: [embed],
    components: [componentRow],
  };
};

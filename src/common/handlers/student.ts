import {
  ActionRowBuilder,
  BaseMessageOptions,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from 'discord.js';
import { Student } from '../../models/Student';
import { embedSeparator } from '../../utils/embedSeparator';

export const handleStudentCommand = async (
  student: Student,
): Promise<BaseMessageOptions> => {
  let rarity = `${student.rarity}★`;

  if (student.isLimited) {
    rarity = `${rarity} (Limited)`;
  }

  if (student.isWelfare) {
    rarity = `${rarity} (Welfare)`;
  }

  let embed = new EmbedBuilder()
    .setTitle(student.fullName)
    .setURL(student.schaledbUrl)
    .addFields(
      {
        name: 'School',
        value: student.school.name,
      },
      {
        name: 'Age',
        value: student.age,
        inline: true,
      },
      {
        name: 'Birthday',
        value: student.birthday,
        inline: true,
      },
      {
        name: 'Height',
        value: student.height,
        inline: true,
      },
      {
        name: 'Hobbies',
        value: student.hobbies ?? 'N/A',
        inline: true,
      },
      {
        name: 'Next Birthday',
        value: student.nextBirthdayString,
        inline: true,
      },
      embedSeparator,
      {
        name: 'Attack Type',
        value: student.attackType?.name ?? 'N/A',
        inline: true,
      },
      {
        name: 'Defense Type',
        value: student.defenseType?.name ?? 'N/A',
        inline: true,
      },
      embedSeparator,
      {
        name: 'Class',
        value: student.combatClass?.name ?? 'N/A',
        inline: true,
      },
      {
        name: 'Role',
        value: student.combatRole?.role ?? 'N/A',
        inline: true,
      },
      {
        name: 'Position',
        value: student.combatPosition?.name ?? 'N/A',
        inline: true,
      },
      {
        name: 'Uses Cover',
        value: student.usesCover ? 'Yes' : 'No',
        inline: true,
      },
      {
        name: 'Weapon Type',
        value: student.weaponType?.name ?? 'N/A',
        inline: true,
      },
      embedSeparator,
      {
        name: 'Rarity',
        value: rarity,
        inline: true,
      },
      {
        name: 'Rec. Lobby unlock level',
        value: student.recorobiLevel ? `❤️ ${student.recorobiLevel}` : 'N/A',
        inline: true,
      },
      embedSeparator,
      {
        name: 'View on schale.gg',
        value: student.schaledbUrl,
      },
    );

  if (student.attackType) {
    embed = embed.setColor(student.attackType.color.toArray());
  }

  if (student.portraitUrl) {
    embed = embed.setThumbnail(student.portraitUrl);
  }

  if (!student.skills || student.skills.length === 0) {
    return {
      embeds: [embed],
    };
  }

  const skillsButton = new ButtonBuilder()
    .setCustomId(`skills_${student.key}`)
    .setLabel('Skills')
    .setStyle(ButtonStyle.Primary);

  const componentRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    skillsButton,
  );

  return {
    embeds: [embed],
    components: [componentRow],
  };
};

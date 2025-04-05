import {
  ActionRowBuilder,
  type BaseMessageOptions,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { embedSeparator } from "../../utils/embedSeparator";
import type { DetailedStudent } from "../../containers/students";
import {
  getAttackTypeColor,
  getPortraitUrl,
  getSchaleDBUrl,
  studentNextBirthdayString,
} from "../../utils/student-utils";
import { t } from "../../utils/localizeTable";

export const handleStudentCommand = async (
  student: DetailedStudent,
): Promise<BaseMessageOptions> => {
  let rarity = `${student.rarity}★`;

  if (student.isLimited) {
    rarity = `${rarity} (Limited)`;
  }

  if (student.isWelfare) {
    rarity = `${rarity} (Welfare)`;
  }

  const schaledbUrl = getSchaleDBUrl(student);
  const portraitUrl = getPortraitUrl(student);
  const nextBirthdayString = studentNextBirthdayString(student);

  let embed = new EmbedBuilder()
    .setTitle(`${student.lastName} ${student.firstName}`)
    .setURL(schaledbUrl)
    .setDescription(student.introduction)
    .addFields(
      {
        name: "School",
        value: t(`school.${student.school}`),
        inline: true,
      },
      {
        name: "Club",
        value: t(`club.${student.club}`),
        inline: true,
      },
      embedSeparator,
      {
        name: "Age",
        value: student.age,
        inline: true,
      },
      {
        name: "Birthday",
        value: student.birthday,
        inline: true,
      },
      {
        name: "Height",
        value: student.height ?? "N/A",
        inline: true,
      },
      {
        name: "Hobbies",
        value: student.hobbies ?? "N/A",
        inline: true,
      },
      {
        name: "Next Birthday",
        value: nextBirthdayString,
        inline: true,
      },
      embedSeparator,
      {
        name: "Attack Type",
        value: student.attackType
          ? t(`attackType.${student.attackType}`)
          : "N/A",
        inline: true,
      },
      {
        name: "Defense Type",
        value: student.defenseType
          ? t(`defenseType.${student.defenseType}`)
          : "N/A",
        inline: true,
      },
      embedSeparator,
      {
        name: "Class",
        value: t(`combatClass.${student.combatClass}`),
        inline: true,
      },
      {
        name: "Role",
        value: t(`combatRole.${student.combatRole}`),
        inline: true,
      },
      {
        name: "Position",
        value: t(`combatPosition.${student.combatPosition}`),
        inline: true,
      },
      {
        name: "Uses Cover",
        value: student.usesCover ? "Yes" : "No",
        inline: true,
      },
      {
        name: "Weapon Type",
        value: t(`weaponType.${student.weaponType}`),
        inline: true,
      },
      embedSeparator,
      {
        name: "Rarity",
        value: rarity,
        inline: true,
      },
      {
        name: "Rec. Lobby unlock level",
        value: student.memorobiLevel ? `❤️ ${student.memorobiLevel}` : "N/A",
        inline: true,
      },
      embedSeparator,
      {
        name: "View on schale.gg",
        value: schaledbUrl,
      },
    );

  if (student.attackType) {
    embed = embed.setColor(getAttackTypeColor(student.attackType).toArray());
  }

  embed = embed.setThumbnail(portraitUrl);

  if (!student.skills || student.skills.length === 0) {
    return {
      embeds: [embed],
    };
  }

  const skillsButton = new ButtonBuilder()
    .setCustomId(`skills_${student.id}`)
    .setLabel("Skills")
    .setStyle(ButtonStyle.Primary);

  const componentRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    skillsButton,
  );

  return {
    embeds: [embed],
    components: [componentRow],
  };
};

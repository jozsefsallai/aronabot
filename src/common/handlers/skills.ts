import {
  ActionRowBuilder,
  type BaseMessageOptions,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import type { DetailedStudent } from "../../containers/students";
import { getPortraitUrl, getSchaleDBUrl } from "../../utils/student-utils";
import { t } from "../../utils/localizeTable";

export const handleStudentSkillsCommand = async (
  student: DetailedStudent,
): Promise<BaseMessageOptions> => {
  if (!student.skills || student.skills.length === 0) {
    return {
      content: `${student.name} currently does not have skill data.`,
    };
  }

  const schaledbUrl = getSchaleDBUrl(student);
  const portraitUrl = getPortraitUrl(student);

  let embed = new EmbedBuilder()
    .setTitle(`${student.name} Skills`)
    .setURL(schaledbUrl)
    .setThumbnail(portraitUrl);

  for (const skill of student.skills) {
    const kind = t(`skillType.${skill.type}`);
    const description = skill.description;

    embed = embed.addFields({
      name: `${kind}: ${skill.name}`,
      value: description,
    });
  }

  const studentButton = new ButtonBuilder()
    .setCustomId(`student_${student.id}`)
    .setLabel("Student Details")
    .setStyle(ButtonStyle.Primary);

  const componentRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    studentButton,
  );

  return {
    embeds: [embed],
    components: [componentRow],
  };
};

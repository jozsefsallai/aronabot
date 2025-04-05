import { EmbedBuilder } from "discord.js";
import { MONTHS } from "../../utils/date";
import type { CommandContext } from "../../core/handler/CommandHandler";
import { studentContainer } from "../../containers/students";
import {
  AppIntegrationType,
  SlashCommandBuilder,
} from "../../utils/slashCommandBuilder";
import {
  getStudentBirthdayData,
  studentHasBirthdayOnMonth,
  studentHasBirthdayToday,
} from "../../utils/student-utils";

export const meta = new SlashCommandBuilder()
  .setName("birthdays")
  .setDescription("Get a list of student birthdays for the a given month.")
  .setIntegrationTypes(
    AppIntegrationType.GuildInstall,
    AppIntegrationType.UserInstall,
  )
  .addIntegerOption((option) => {
    return option
      .setName("month")
      .setDescription("The month to get birthdays for.")
      .setChoices(
        ...MONTHS.map((month, index) => ({ name: month, value: index })),
      );
  });

export const handler = async (ctx: CommandContext) => {
  await ctx.interaction.deferReply();

  const month =
    (ctx.interaction.options.get("month")?.value as number | undefined) ??
    new Date().getMonth();

  const students = studentContainer
    .getStudents()
    .filter((student) => studentHasBirthdayOnMonth(student, month));

  if (students.length === 0) {
    await ctx.interaction.editReply({
      content: `No students have birthdays in ${MONTHS[month]}.`,
    });

    return;
  }

  const sortedStudents = students.sort((a, b) => {
    const aBirthday = getStudentBirthdayData(a);
    const bBirthday = getStudentBirthdayData(b);

    if (!aBirthday || !bBirthday) {
      return 0;
    }

    return aBirthday.day - bBirthday.day;
  });

  const lines = sortedStudents.map((student) => {
    let line = `🎂 ${student.lastName} ${student.firstName} - ${student.birthday}`;

    if (studentHasBirthdayToday(student)) {
      line = `**🎉 ${line} 🎉**`;
    }

    return line;
  });

  const uniqueLines = Array.from(new Set(lines));

  const embed = new EmbedBuilder()
    .setTitle(`Birthdays in ${MONTHS[month]}`)
    .setDescription(uniqueLines.join("\n"));

  await ctx.interaction.editReply({
    embeds: [embed],
  });
};

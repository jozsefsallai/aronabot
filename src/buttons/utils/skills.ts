import { handleStudentSkillsCommand } from "../../common/handlers/skills";
import { findById as findStudentById } from "../../db/students";
import type { ButtonContext } from "../../core/handler/ButtonHandler";

export const meta = {
  id: "skills",
};

export const handler = async (ctx: ButtonContext) => {
  if (
    ctx.interaction.message.interaction?.user.id !== ctx.interaction.user.id
  ) {
    await ctx.interaction.reply({
      content: "You cannot use this button.",
      ephemeral: true,
    });

    return;
  }

  if (!ctx.uniqueId) {
    await ctx.interaction.reply("Button has no unique ID.");
    return;
  }

  // `${studentId}` or `${studentId}:${page}` for the page buttons.
  const [studentKey, pageKey] = ctx.uniqueId.split(":");
  const page = pageKey !== undefined ? Number(pageKey) : 0;

  const student = await findStudentById(studentKey);
  if (!student) {
    await ctx.interaction.reply("Student not found.");
    return;
  }

  const response = await handleStudentSkillsCommand(
    student,
    Number.isInteger(page) ? page : 0,
  );
  await ctx.interaction.update(response);
};

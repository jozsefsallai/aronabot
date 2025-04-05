import { handleStudentCommand } from "../../common/handlers/student";
import { studentContainer } from "../../containers/students";
import type { ButtonContext } from "../../core/handler/ButtonHandler";

export const meta = {
  id: "student",
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

  const studentKey = ctx.uniqueId;

  const student = studentContainer.getStudent(studentKey);
  if (!student) {
    await ctx.interaction.reply("Student not found.");
    return;
  }

  const response = await handleStudentCommand(student);
  await ctx.interaction.update(response);
};

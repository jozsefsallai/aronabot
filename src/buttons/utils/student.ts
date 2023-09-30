import { handleStudentCommand } from '../../common/handlers/student';
import { studentContainer } from '../../containers/students';
import { ButtonContext } from '../../core/handler/ButtonHandler';

export const meta = {
  id: 'student',
};

export const handler = async (ctx: ButtonContext) => {
  await ctx.interaction.deferReply();

  if (!ctx.uniqueId) {
    await ctx.interaction.editReply('Button has no unique ID.');
  }

  const studentKey = ctx.uniqueId!;

  const student = studentContainer.getStudent(studentKey);
  if (!student) {
    await ctx.interaction.editReply('Student not found.');
    return;
  }

  await handleStudentCommand(student, ctx);
};

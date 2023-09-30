import { handleStudentCommand } from '../../common/handlers/student';
import { studentContainer } from '../../containers/students';
import { ButtonContext } from '../../core/handler/ButtonHandler';

export const meta = {
  id: 'student',
};

export const handler = async (ctx: ButtonContext) => {
  if (!ctx.uniqueId) {
    await ctx.interaction.reply('Button has no unique ID.');
  }

  const studentKey = ctx.uniqueId!;

  const student = studentContainer.getStudent(studentKey);
  if (!student) {
    await ctx.interaction.reply('Student not found.');
    return;
  }

  const response = await handleStudentCommand(student);
  await ctx.interaction.update(response);
};

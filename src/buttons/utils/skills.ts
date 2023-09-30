import { handleStudentSkillsCommand } from '../../common/handlers/skills';
import { studentContainer } from '../../containers/students';
import { ButtonContext } from '../../core/handler/ButtonHandler';

export const meta = {
  id: 'skills',
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

  await handleStudentSkillsCommand(student, ctx);
};

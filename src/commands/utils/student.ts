import { SlashCommandBuilder } from 'discord.js';
import { CommandContext } from '../../core/handler/CommandHandler';
import { studentContainer } from '../../containers/students';
import { AutocompleteContext } from '../../core/handler/AutocompleteHandler';
import { handleStudentCommand } from '../../common/handlers/student';

export const meta = new SlashCommandBuilder()
  .setName('student')
  .setDescription('Get information about a student.')
  .addStringOption((option) => {
    return option
      .setName('name')
      .setDescription('The name of the student.')
      .setRequired(true)
      .setAutocomplete(true);
  });

export const autocomplete = async (ctx: AutocompleteContext) => {
  const focusedValue = ctx.interaction.options.getFocused();

  if (!focusedValue || focusedValue.length < 2) {
    await ctx.interaction.respond([]);
    return;
  }

  const students = studentContainer.findManyByName(focusedValue);
  await ctx.interaction.respond(
    students.map((student) => {
      return {
        name: student.name,
        value: student.name,
      };
    }),
  );
};

export const handler = async (ctx: CommandContext) => {
  await ctx.interaction.deferReply();

  const name = ctx.interaction.options.get('name')!.value as string;
  const student = studentContainer.getByName(name);

  if (!student) {
    await ctx.interaction.editReply({
      content: `Could not find a student with the name "${name}".`,
    });

    return;
  }

  await handleStudentCommand(student, ctx);
};

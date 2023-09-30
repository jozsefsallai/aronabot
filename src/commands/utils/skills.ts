import { SlashCommandBuilder } from 'discord.js';
import { AutocompleteContext } from '../../core/handler/AutocompleteHandler';
import { studentContainer } from '../../containers/students';
import { CommandContext } from '../../core/handler/CommandHandler';
import { handleStudentSkillsCommand } from '../../common/handlers/skills';

export const meta = new SlashCommandBuilder()
  .setName('skills')
  .setDescription("(BETA) Get information about a student's skills.")
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

  const response = await handleStudentSkillsCommand(student);
  await ctx.interaction.editReply(response);
};

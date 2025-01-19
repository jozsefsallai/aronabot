import { EmbedBuilder } from 'discord.js';
import { CommandContext } from '../../core/handler/CommandHandler';
import seedrandom from 'seedrandom';
import { studentContainer } from '../../containers/students';
import { GAME_BLUE } from '../../utils/constants';
import {
  SlashCommandBuilder,
  AppIntegrationType,
} from '../../utils/slashCommandBuilder';
import {
  currentTimeJST,
  dateToJST,
  resetTimeForDateJST,
} from '../../utils/date';

export const meta = new SlashCommandBuilder()
  .setName('studentoftheday')
  .setDescription('Find out who your student of the day is!')
  .setIntegrationTypes(
    AppIntegrationType.GuildInstall,
    AppIntegrationType.UserInstall,
  )
  .addStringOption((option) => {
    return option
      .setName('date')
      .setDescription(
        'The date to get the student of the day for (YYYY/MM/DD).',
      )
      .setRequired(false);
  });

const areSameDay = (d1: Date, d2: Date): boolean => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

function getCustomDate(str: string): Date {
  const date = new Date(str);
  date.setDate(date.getDate() + 1);
  return dateToJST(date);
}

export const handler = async (ctx: CommandContext) => {
  await ctx.interaction.deferReply();

  const userId = ctx.interaction.user.id;

  const dateArg = ctx.interaction.options.get('date')?.value as
    | string
    | undefined;

  const today = currentTimeJST();

  const date = dateArg ? getCustomDate(dateArg) : today;
  if (!date || isNaN(date.getTime())) {
    await ctx.interaction.editReply('Invalid date provided.');
    return;
  }

  if (date.getTime() > today.getTime()) {
    await ctx.interaction.editReply('Input cannot be a future date.');
    return;
  }

  const resetDate = resetTimeForDateJST(date);
  const dateTimestamp = Math.floor(resetDate.getTime() / 1000);

  const seed = Buffer.from(`${dateTimestamp}/${userId}`, 'utf-8')
    .toString('base64')
    .replace(/=/g, '');
  const rng = seedrandom(seed);

  const students = studentContainer.getStudents();
  let student = students[Math.floor(rng() * students.length)];

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowReset = resetTimeForDateJST(tomorrow);
  const tomorrowTimestamp = Math.floor(tomorrowReset.getTime() / 1000);

  const description = areSameDay(date, today)
    ? `${ctx.interaction.user.toString()}'s student of the day is **${
        student.name
      }**.\n\nNext student of the day can be chosen <t:${tomorrowTimestamp}:R>`
    : `${ctx.interaction.user.toString()}'s student of the day on **${resetDate.toDateString()}** was **${
        student.name
      }**.`;

  const embed = new EmbedBuilder()
    .setTitle(student.fullName)
    .setDescription(description)
    .setImage(student.portraitUrl)
    .setColor((student.attackType?.color ?? GAME_BLUE).toArray())
    .setFooter({
      text: `Seed: ${seed}`,
    });

  await ctx.interaction.editReply({
    embeds: [embed],
  });
};

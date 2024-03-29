import { EmbedBuilder } from 'discord.js';
import { CommandContext } from '../../core/handler/CommandHandler';
import seedrandom from 'seedrandom';
import { studentContainer } from '../../containers/students';
import { GAME_BLUE } from '../../utils/constants';
import {
  SlashCommandBuilder,
  AppIntegrationType,
} from '../../utils/slashCommandBuilder';

export const meta = new SlashCommandBuilder()
  .setName('studentoftheday')
  .setDescription('Find out who your student of the day is!')
  .setIntegrationTypes(
    AppIntegrationType.GuildInstall,
    AppIntegrationType.UserInstall,
  );

export const handler = async (ctx: CommandContext) => {
  await ctx.interaction.deferReply();

  const userId = ctx.interaction.user.id;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = Math.floor(today.getTime() / 1000);

  const seed = Buffer.from(`${todayTimestamp}/${userId}`, 'utf-8')
    .toString('base64')
    .replace(/=/g, '');
  const rng = seedrandom(seed);

  const students = studentContainer.getStudents();
  const student = students[Math.floor(rng() * students.length)];

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const tomorrowTimestamp = Math.floor(tomorrow.getTime() / 1000);

  const embed = new EmbedBuilder()
    .setTitle(student.fullName)
    .setDescription(
      `${ctx.interaction.user.toString()}'s student of the day is **${
        student.name
      }**.\n\nNext student of the day can be chosen <t:${tomorrowTimestamp}:R>`,
    )
    .setImage(student.wikiImage)
    .setColor((student.attackType?.color ?? GAME_BLUE).toArray())
    .setFooter({
      text: `Seed: ${seed}`,
    });

  await ctx.interaction.editReply({
    embeds: [embed],
  });
};

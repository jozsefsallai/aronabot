import seedrandom from 'seedrandom';
import { studentContainer } from '../../containers/students';
import { CommandContext } from '../../core/handler/CommandHandler';
import { currentClosestBreakpointJST } from '../../utils/date';
import {
  AppIntegrationType,
  SlashCommandBuilder,
} from '../../utils/slashCommandBuilder';
import { Student } from '../../models/Student';
import { EmbedBuilder } from 'discord.js';

export const meta = new SlashCommandBuilder()
  .setName('cafe')
  .setDescription('Simulate bi-daily cafe visits.')
  .setIntegrationTypes(
    AppIntegrationType.GuildInstall,
    AppIntegrationType.UserInstall,
  );

export const handler = async (ctx: CommandContext) => {
  await ctx.interaction.deferReply();

  const userId = ctx.interaction.user.id;

  const closestBreakpoint = currentClosestBreakpointJST();
  const timestamp = Math.floor(closestBreakpoint.getTime() / 1000);

  const students = studentContainer.getBaseVariants();

  const seed = Buffer.from(`${timestamp}/${userId}`, 'utf-8')
    .toString('base64')
    .replace(/=/g, '');
  const rng = seedrandom(seed);

  const cafe1: Student[] = [];
  const cafe2: Student[] = [];

  for (let i = 0; i < 10; ++i) {
    const randomBase = students[Math.floor(rng() * students.length)];
    const variants = studentContainer.getVariantsForBase(randomBase);
    const randomVariant = variants[Math.floor(rng() * variants.length)];

    if (i < 5) {
      cafe1.push(randomVariant);
    } else {
      cafe2.push(randomVariant);
    }

    students.splice(students.indexOf(randomBase), 1);
  }

  const next = new Date(closestBreakpoint);
  next.setHours(next.getHours() + 12);

  const embed = new EmbedBuilder()
    .setTitle('Cafe Visits')
    .setDescription('Sensei! The following students have visited your cafes!')
    .addFields(
      {
        name: 'Cafe 1',
        value: cafe1.map((student) => student.name).join('\n'),
        inline: true,
      },
      {
        name: 'Cafe 2',
        value: cafe2.map((student) => student.name).join('\n'),
        inline: true,
      },
      {
        name: 'Next Cafe Visit',
        value: `<t:${Math.floor(next.getTime() / 1000)}:R>`,
      },
    )
    .setColor('#58dcf3')
    .setFooter({
      text: `Time: ${timestamp}`,
    });

  await ctx.interaction.editReply({
    embeds: [embed],
  });
};

import { EmbedBuilder } from 'discord.js';
import { CommandContext } from '../../core/handler/CommandHandler';
import { missionContainer } from '../../containers/missions';
import {
  AppIntegrationType,
  SlashCommandBuilder,
} from '../../utils/slashCommandBuilder';

export const meta = new SlashCommandBuilder()
  .setName('mission')
  .setDescription('Get information and map preview about a mission.')
  .setIntegrationTypes(
    AppIntegrationType.GuildInstall,
    AppIntegrationType.UserInstall,
  )
  .addStringOption((option) => {
    return option
      .setName('name')
      .setDescription('The name of the mission.')
      .setRequired(true);
  });

export const handler = async (ctx: CommandContext) => {
  await ctx.interaction.deferReply();

  const name = ctx.interaction.options.get('name')!.value as string;

  const mission = missionContainer.getMissionWithName(name);

  if (!mission) {
    await ctx.interaction.editReply({
      content: `Could not find mission "${name}".`,
    });

    return;
  }

  let embed = new EmbedBuilder()
    .setTitle(mission.name)
    .setURL(mission.getMirahezeWikiUrl())
    .addFields(
      {
        name: 'Cost',
        value: mission.cost.toString(),
        inline: true,
      },
      {
        name: 'Difficulty',
        value: mission.difficulty ? mission.difficulty.name : 'Unknown',
        inline: true,
      },
      {
        name: 'Terrain',
        value: mission.terrain ? mission.terrain.name : 'Unknown',
        inline: true,
      },
      {
        name: 'Rec. lvl',
        value: mission.recommendedLevel.toString(),
        inline: true,
      },
      {
        name: 'Drops',
        value: mission.drops.join(', '),
      },
      {
        name: 'Text guide',
        value: mission.getMirahezeWikiUrl(),
      },
    );

  if (mission.stageImageUrl) {
    embed = embed.setImage(mission.stageImageUrl);
  }

  await ctx.interaction.editReply({
    embeds: [embed],
  });
};

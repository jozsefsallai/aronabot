import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BannerKind } from '../../gacha/kind';
import { CommandContext } from '../../core/handler/CommandHandler';
import recruitmentPointsManager from '../../gacha/points';
import { GAME_BLUE, GAME_RED } from '../../utils/constants';

export const meta = new SlashCommandBuilder()
  .setName('spark')
  .setDescription('Use 200 recruitment points on a game region.')
  .addStringOption((option) => {
    return option
      .setName('region')
      .setDescription('The game region to reset.')
      .addChoices(
        {
          name: 'Global',
          value: BannerKind.GLOBAL,
        },
        {
          name: 'JP',
          value: BannerKind.JP,
        },
      );
  });

export const handler = async (ctx: CommandContext) => {
  await ctx.interaction.deferReply();

  let bannerKind = ctx.interaction.options.get('region')?.value as
    | BannerKind
    | undefined;

  if (!bannerKind) {
    bannerKind = BannerKind.GLOBAL;
  }

  const guildId = ctx.interaction.guildId ?? '0';
  const userId = ctx.interaction.user.id;

  const currentAmount = await recruitmentPointsManager.get(
    bannerKind,
    guildId,
    userId,
  );

  const banner = bannerKind === BannerKind.GLOBAL ? 'Global' : 'JP';

  if (!currentAmount || currentAmount < 200) {
    const embed = new EmbedBuilder()
      .setTitle('Recruitment Points Reset')
      .setDescription(
        `You may not use this command until you have at least 200 recruitment points on **${banner}**.`,
      )
      .setColor(GAME_RED.toArray());

    await ctx.interaction.editReply({
      embeds: [embed],
    });

    return;
  }

  await recruitmentPointsManager.set(
    bannerKind,
    guildId,
    userId,
    currentAmount - 200,
  );

  const embed = new EmbedBuilder()
    .setTitle('Recruitment Points Reset')
    .setDescription(`Used 200 of your recruitment points on **${banner}**.`)
    .setColor(GAME_BLUE.toArray());

  await ctx.interaction.editReply({
    embeds: [embed],
  });
};

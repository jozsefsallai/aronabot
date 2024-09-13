import { SlashCommandBuilder } from 'discord.js';
import { staffOnlyGuard } from '../../core/guards/staffOnly';
import { CommandContext } from '../../core/handler/CommandHandler';
import { BannerKind } from '../../gacha/kind';
import recruitmentPointsManager from '../../gacha/points';

export const meta = new SlashCommandBuilder()
  .setName('rrp')
  .setDescription('[STAFF] Reset recruitment points.')
  .setDefaultPermission(false)
  .addStringOption((option) => {
    return option
      .setName('region')
      .setDescription('The game region to reset recruitment points for.')
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

export const handler = staffOnlyGuard(async (ctx: CommandContext) => {
  await ctx.interaction.deferReply({ ephemeral: true });

  let bannerKind = ctx.interaction.options.get('region')?.value as
    | BannerKind
    | undefined;

  if (!bannerKind) {
    bannerKind = BannerKind.GLOBAL;
  }

  const result = await recruitmentPointsManager.resetAll(bannerKind);
  if (!result) {
    await ctx.interaction.editReply(
      'Failed to reset recruitment points. Was the Redis connection established?',
    );
  } else {
    await ctx.interaction.editReply(
      `Recruitment points reset for ${bannerKind}.`,
    );
  }
});

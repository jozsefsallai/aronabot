import { CommandContext } from '../../core/handler/CommandHandler';

import { bannerContainer } from '../../containers/banners';
import { GachaBrowser } from '../../gacha/browser';
import recruitmentPointsManager from '../../gacha/points';
import { BannerKind } from '../../gacha/kind';
import { iconsContainer } from '../../containers/icons';
import { AutocompleteContext } from '../../core/handler/AutocompleteHandler';
import {
  AppIntegrationType,
  SlashCommandBuilder,
} from '../../utils/slashCommandBuilder';

function getBannerChoices() {
  return bannerContainer
    .all()
    .filter((b) => b.kind !== BannerKind.CHROMA)
    .map((banner) => {
      return {
        name: banner.name,
        value: banner.id,
      };
    });
}

export const meta = new SlashCommandBuilder()
  .setName('gacha')
  .setDescription('Roll on the current banners.')
  .setIntegrationTypes(
    AppIntegrationType.GuildInstall,
    AppIntegrationType.UserInstall,
  )
  .addStringOption((option) => {
    return option
      .setName('banner')
      .setDescription('The banner to pull on.')
      .setRequired(true)
      .setAutocomplete(true);
  });

export const autocomplete = async (ctx: AutocompleteContext) => {
  await ctx.interaction.respond(getBannerChoices());
};

export const handler = async (ctx: CommandContext) => {
  await ctx.interaction.deferReply();

  if (!iconsContainer.isReady) {
    await ctx.interaction.editReply(
      'Service currently unavailable. Please try again later...',
    );
    return;
  }

  let bannerName = ctx.interaction.options.get('banner')?.value as
    | string
    | undefined;

  if (!bannerName) {
    bannerName = 'regular';
  }

  const guildId = ctx.interaction.guildId ?? '0';
  const userId = ctx.interaction.user.id;

  const banner = bannerContainer.getBanner(bannerName);

  const points = await recruitmentPointsManager.incrementAndGet(
    banner!.kind,
    guildId,
    userId,
  );

  const browser = await GachaBrowser.getInstance();
  const image = await browser.getScreenshot(bannerName, points);

  await ctx.interaction.editReply({
    files: [
      {
        attachment: image,
        name: 'gacha_result.png',
      },
    ],
  });
};

import { SlashCommandBuilder } from 'discord.js';
import { CommandContext } from '../../core/handler/CommandHandler';

import { bannerContainer } from '../../containers/banners';
import { GachaBrowser } from '../../gacha/browser';

function getBannerChoices() {
  return bannerContainer.all().map((banner) => {
    return {
      name: banner.name,
      value: banner.id,
    };
  });
}

export const meta = new SlashCommandBuilder()
  .setName('gacha')
  .setDescription('Roll on the current banner.')
  .addStringOption((option) => {
    return option
      .setName('banner')
      .setDescription('The banner to pull on.')
      .setChoices(...getBannerChoices());
  });

export const handler = async (ctx: CommandContext) => {
  await ctx.interaction.deferReply();

  let bannerName = ctx.interaction.options.get('banner')?.value as
    | string
    | undefined;

  if (!bannerName) {
    bannerName = 'regular';
  }

  const browser = await GachaBrowser.getInstance();
  const image = await browser.getScreenshot(bannerName);

  await ctx.interaction.editReply({
    files: [
      {
        attachment: image,
        name: 'gacha_result.png',
      },
    ],
  });
};

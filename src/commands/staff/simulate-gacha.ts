import { SlashCommandBuilder } from 'discord.js';
import { staffOnlyGuard } from '../../core/guards/staffOnly';
import { CommandContext } from '../../core/handler/CommandHandler';
import { bannerContainer } from '../../containers/banners';
import { Rarity } from '../../models/Rarity';
import { AutocompleteContext } from '../../core/handler/AutocompleteHandler';

function getBannerChoices() {
  return bannerContainer
    .all()
    .slice(0, 25)
    .map((banner) => {
      return {
        name: banner.name,
        value: banner.id,
      };
    });
}

export const meta = new SlashCommandBuilder()
  .setName('simulate-gacha')
  .setDescription('[STAFF] Simulate gacha pulls to audit rates.')
  .setDefaultPermission(false)
  .addStringOption((option) => {
    return option
      .setName('banner')
      .setDescription('The banner to simulate.')
      .setRequired(true)
      .setAutocomplete(true);
  })
  .addIntegerOption((option) => {
    return option.setName('count').setDescription('The number of simulations.');
  })
  .addIntegerOption((option) => {
    return option
      .setName('pulls-per-simulation')
      .setDescription('The number of pulls per simulation.');
  });

export const autocomplete = async (ctx: AutocompleteContext) => {
  await ctx.interaction.respond(getBannerChoices());
};

export const handler = staffOnlyGuard(async (ctx: CommandContext) => {
  await ctx.interaction.deferReply({ ephemeral: true });

  let bannerName = ctx.interaction.options.get('region')?.value as
    | string
    | undefined;

  if (!bannerName) {
    bannerName = 'regular';
  }

  let count = ctx.interaction.options.get('count')?.value as number | undefined;
  let pullsPerSimulation = ctx.interaction.options.get('pulls-per-simulation')
    ?.value as number | undefined;

  if (!count) {
    count = 10;
  }

  if (!pullsPerSimulation) {
    pullsPerSimulation = 1000;
  }

  const banner = bannerContainer.getBanner(bannerName);
  if (!banner) {
    await ctx.interaction.editReply('Banner not found!');
    return;
  }

  const results = [];

  for (let i = 0; i < count; ++i) {
    let oneStarCount = 0;
    let twoStarCount = 0;
    let threeStarCount = 0;

    try {
      for (let j = 0; j < pullsPerSimulation; ++j) {
        const students = banner.pullTen();

        for (const [student, _] of students) {
          if (student.rarity === Rarity.OneStar) {
            oneStarCount++;
          } else if (student.rarity === Rarity.TwoStar) {
            twoStarCount++;
          } else if (student.rarity === Rarity.ThreeStar) {
            threeStarCount++;
          }
        }
      }
    } catch (err: any) {
      await ctx.interaction.editReply(err.message);
      return;
    }

    const oneStarRate = oneStarCount / pullsPerSimulation;
    const twoStarRate = twoStarCount / pullsPerSimulation;
    const threeStarRate = threeStarCount / pullsPerSimulation;

    results.push({
      oneStarCount,
      twoStarCount,
      threeStarCount,

      oneStarRate,
      twoStarRate,
      threeStarRate,
    });
  }

  const summary = {
    oneStarCount: 0,
    twoStarCount: 0,
    threeStarCount: 0,

    oneStarRate: 0,
    twoStarRate: 0,
    threeStarRate: 0,
  };

  for (const result of results) {
    summary.oneStarCount += result.oneStarCount;
    summary.twoStarCount += result.twoStarCount;
    summary.threeStarCount += result.threeStarCount;
  }

  summary.oneStarRate = summary.oneStarCount / (pullsPerSimulation * count);
  summary.twoStarRate = summary.twoStarCount / (pullsPerSimulation * count);
  summary.threeStarRate = summary.threeStarCount / (pullsPerSimulation * count);

  const json = JSON.stringify(
    {
      bannerName,
      count,
      pullsPerSimulation,
      results,
      summary,
    },
    null,
    2,
  );

  const file = Buffer.from(json, 'utf-8');
  await ctx.interaction.editReply({
    files: [
      {
        attachment: file,
        name: 'gacha_simulation.json',
      },
    ],
  });
});

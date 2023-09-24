import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { CommandContext } from '../../core/handler/CommandHandler';
import { studentContainer } from '../../containers/students';
import { AutocompleteContext } from '../../core/handler/AutocompleteHandler';
import { embedSeparator } from '../../utils/embedSeparator';

export const meta = new SlashCommandBuilder()
  .setName('student')
  .setDescription('Get information about a student.')
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

  let rarity = `${student.rarity}★`;

  if (student.isLimited) {
    rarity = `${rarity} (Limited)`;
  }

  if (student.isWelfare) {
    rarity = `${rarity} (Welfare)`;
  }

  let embed = new EmbedBuilder()
    .setTitle(student.fullName)
    .setURL(student.schaledbUrl)
    .addFields(
      {
        name: 'School',
        value: student.school.name,
      },
      {
        name: 'Age',
        value: student.age,
        inline: true,
      },
      {
        name: 'Birthday',
        value: student.birthday,
        inline: true,
      },
      {
        name: 'Height',
        value: student.height,
        inline: true,
      },
      {
        name: 'Hobbies',
        value: student.hobbies ?? 'N/A',
        inline: true,
      },
      {
        name: 'Next Birthday',
        value: student.nextBirthdayString,
        inline: true,
      },
      embedSeparator,
      {
        name: 'Attack Type',
        value: student.attackType?.name ?? 'N/A',
        inline: true,
      },
      {
        name: 'Defense Type',
        value: student.defenseType?.name ?? 'N/A',
        inline: true,
      },
      embedSeparator,
      {
        name: 'Class',
        value: student.combatClass?.name ?? 'N/A',
        inline: true,
      },
      {
        name: 'Role',
        value: student.combatRole?.role ?? 'N/A',
        inline: true,
      },
      {
        name: 'Position',
        value: student.combatPosition?.name ?? 'N/A',
        inline: true,
      },
      {
        name: 'Uses Cover',
        value: student.usesCover ? 'Yes' : 'No',
        inline: true,
      },
      {
        name: 'Weapon Type',
        value: student.weaponType?.name ?? 'N/A',
        inline: true,
      },
      embedSeparator,
      {
        name: 'Rarity',
        value: rarity,
      },
      {
        name: 'View on schale.gg',
        value: student.schaledbUrl,
      },
    );

  if (student.attackType) {
    embed = embed.setColor(student.attackType.color.toArray());
  }

  if (student.wikiImage) {
    embed = embed.setThumbnail(student.wikiImage);
  }

  await ctx.interaction.editReply({
    embeds: [embed],
  });
};

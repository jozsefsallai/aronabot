import { ApplicationCommandPermissions as ApplicationCommandPermissionData } from 'discord.js';
import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  ContextMenuCommandBuilder,
} from 'discord.js';

import { CommandContext } from '../core/handler/CommandHandler';
import { AutocompleteContext } from '../core/handler/AutocompleteHandler';

import * as gacha from './fun/gacha';
import * as spark from './fun/spark';

import * as student from './utils/student';
import * as skills from './utils/skills';
import * as mission from './utils/mission';
import * as birthdays from './utils/birthdays';

interface CommandData {
  meta:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
    | SlashCommandSubcommandsOnlyBuilder
    | ContextMenuCommandBuilder;
  handler: (ctx: CommandContext<any>) => void | Promise<void>;
  permissions?: ApplicationCommandPermissionData[];
  autocomplete?: (ctx: AutocompleteContext<any>) => void | Promise<void>;
}

const commands: CommandData[] = [
  gacha,
  spark,
  student,
  skills,
  mission,
  birthdays,
];

export default commands;

import { ApplicationCommandPermissions as ApplicationCommandPermissionData } from 'discord.js';
import {
  SlashCommandBuilder as DJSSlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  ContextMenuCommandBuilder,
} from 'discord.js';

import { CommandContext } from '../core/handler/CommandHandler';
import { AutocompleteContext } from '../core/handler/AutocompleteHandler';

import * as gacha from './fun/gacha';
import * as spark from './fun/spark';
import * as sotd from './fun/sotd';

import * as student from './utils/student';
import * as skills from './utils/skills';
import * as mission from './utils/mission';
import * as birthdays from './utils/birthdays';
import * as gifts from './utils/gifts';

import * as reload from './staff/reload';
import * as rrp from './staff/rrp';
import * as simulateGacha from './staff/simulate-gacha';

import { SlashCommandBuilder } from '../utils/slashCommandBuilder';

interface CommandData {
  meta:
    | DJSSlashCommandBuilder
    | SlashCommandBuilder
    | Omit<DJSSlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
    | SlashCommandSubcommandsOnlyBuilder
    | ContextMenuCommandBuilder;
  handler: (ctx: CommandContext<any>) => void | Promise<void>;
  permissions?: ApplicationCommandPermissionData[];
  autocomplete?: (ctx: AutocompleteContext<any>) => void | Promise<void>;
}

const commands: CommandData[] = [
  gacha,
  spark,
  sotd,
  student,
  skills,
  mission,
  birthdays,
  gifts,
  reload,
  rrp,
  simulateGacha,
];

export default commands;

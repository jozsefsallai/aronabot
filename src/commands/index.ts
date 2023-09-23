import { ApplicationCommandPermissions as ApplicationCommandPermissionData } from 'discord.js';
import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  ContextMenuCommandBuilder,
} from 'discord.js';
import { CommandContext } from '../core/handler/CommandHandler';

import * as gacha from './fun/gacha';

interface CommandData {
  meta:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
    | SlashCommandSubcommandsOnlyBuilder
    | ContextMenuCommandBuilder;
  handler: (ctx: CommandContext<any>) => void | Promise<void>;
  permissions?: ApplicationCommandPermissionData[];
}

const commands: CommandData[] = [gacha];

export default commands;

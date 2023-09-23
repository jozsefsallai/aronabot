import config from '../config';

import onReady from '../events/ready';

import {
  ActivityType,
  Client as Discord,
  IntentsBitField,
  Routes,
} from 'discord.js';
import { REST } from '@discordjs/rest';

import CommandHandler from './handler/CommandHandler';
import commands from '../commands';

class Client {
  private client: Discord;
  private rest: REST;

  private commandHandler: CommandHandler;

  constructor() {
    this.client = new Discord({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
      ],
    });

    this.rest = new REST({ version: '9' }).setToken(config.bot.token);

    this.commandHandler = new CommandHandler();

    this.client.on('interactionCreate', async (interaction) => {
      if (interaction.isCommand() || interaction.isContextMenuCommand()) {
        await this.commandHandler.emit(interaction.commandName, {
          interaction,
          client: this,
        });
      }
    });

    this.client.on('ready', () => onReady(this));
  }

  async login() {
    console.log('Updating application commands...');

    await this.rest.put(Routes.applicationCommands(config.bot.clientId), {
      body: commands.map((command) => command.meta.toJSON()),
    });

    commands.forEach((command) => {
      this.commandHandler.on(command.meta.name, command.handler);
      this.commandHandler.setPermissions(
        command.meta.name,
        command.permissions,
      );
    });

    console.log('Application commands updated successfully.');

    await this.client.login(config.bot.token);

    console.log('AronaBot started successfully.');
  }

  setPlayingStatus(message: string, type?: ActivityType, url?: string) {
    this.client.user?.setPresence({
      status: 'online',
      activities: [
        {
          name: message,
          type: type ?? ActivityType.Playing,
          url,
        },
      ],
    });
  }
}

export default Client;

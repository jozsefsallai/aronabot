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
import AutocompleteHandler from './handler/AutocompleteHandler';
import ButtonHandler from './handler/ButtonHandler';

import commands from '../commands';
import buttons from '../buttons';

class Client {
  private client: Discord;
  private rest: REST;

  private commandHandler: CommandHandler;
  private autocompleteHandler: AutocompleteHandler;
  private buttonHandler: ButtonHandler;

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
    this.autocompleteHandler = new AutocompleteHandler();
    this.buttonHandler = new ButtonHandler();

    this.client.on('interactionCreate', async (interaction) => {
      if (interaction.isAutocomplete()) {
        if (!config.isMaintenance) {
          await this.autocompleteHandler.emit(interaction.commandName, {
            interaction,
            client: this,
          });
        }

        return;
      }

      if (interaction.isCommand() || interaction.isContextMenuCommand()) {
        if (config.isMaintenance) {
          await interaction.reply({
            content: '⚠️ Maintenance in progress. Please try again later.',
          });

          return;
        }

        await this.commandHandler.emit(interaction.commandName, {
          interaction,
          client: this,
        });
      }

      if (interaction.isButton()) {
        const idComponents = interaction.customId.split('_');
        const id = idComponents[0];
        const uniqueId =
          idComponents.length > 1 ? idComponents.slice(1).join('_') : undefined;

        await this.buttonHandler.emit(id, {
          interaction,
          client: this,
          uniqueId,
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

      if (command.autocomplete) {
        this.autocompleteHandler.on(command.meta.name, command.autocomplete);
      }
    });

    console.log('Application commands updated successfully.');

    console.log('Registering button handlers...');

    buttons.forEach((button) => {
      this.buttonHandler.on(button.meta.id, button.handler);
    });

    console.log('Button handlers registered successfully.');

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

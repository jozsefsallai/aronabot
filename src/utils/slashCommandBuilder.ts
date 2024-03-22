import {
  SlashCommandBuilder as DJSSlashCommandBuilder,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord.js';

export enum AppIntegrationType {
  // App is installable to servers
  GuildInstall = 0,

  // App is installable to users
  UserInstall = 1,
}

export enum InteractionContextType {
  // Interaction can be used within servers
  Guild = 0,

  // Interaction can be used within DMs with the app's bot user
  BotDM = 1,

  // Interaction can be used within Group DMs and DMs other than the app's bot user
  PrivateChannel = 2,
}

export class SlashCommandBuilder extends DJSSlashCommandBuilder {
  private _integrationTypes: AppIntegrationType[] = [
    AppIntegrationType.GuildInstall,
  ];

  private _contexts: InteractionContextType[] = [
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel,
  ];

  get integrationTypes() {
    return this._integrationTypes;
  }

  get contexts() {
    return this._contexts;
  }

  setIntegrationTypes(...types: AppIntegrationType[]) {
    this._integrationTypes = types;
    return this;
  }

  setContexts(...contexts: InteractionContextType[]) {
    this._contexts = contexts;
    return this;
  }

  toJSON(): RESTPostAPIChatInputApplicationCommandsJSONBody & {
    integration_types: AppIntegrationType[];
    contexts: InteractionContextType[];
  } {
    return {
      ...super.toJSON(),
      integration_types: this.integrationTypes,
      contexts: this.contexts,
    };
  }
}

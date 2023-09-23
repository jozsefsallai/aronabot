export interface BotConfig {
  token: string;
  clientId: string;
  defaultActivity?: string;
  ownerId: string;
}

export interface IConfig {
  bot: BotConfig;
}

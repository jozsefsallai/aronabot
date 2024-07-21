export interface RedisConfig {
  url: string;
}

export interface BotConfig {
  token: string;
  clientId: string;
  defaultActivity?: string;
  ownerId: string;
  staffIds: string[];
}

export interface IConfig {
  bot: BotConfig;
  redis?: RedisConfig;
  isMaintenance: boolean;
}

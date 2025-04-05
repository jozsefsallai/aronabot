import config from "../config";
import type Client from "../core/client";

const handler = async (client: Client) => {
  if (config.bot.defaultActivity) {
    client.setPlayingStatus(config.bot.defaultActivity);
  }
};

export default handler;

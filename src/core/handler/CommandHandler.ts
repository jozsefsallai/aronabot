import type {
  CommandInteraction,
  ContextMenuCommandInteraction as ContextMenuInteraction,
  ApplicationCommandPermissions as ApplicationCommandPermissionData,
} from "discord.js";
import BaseHandler from "./BaseHandler";
import type { HandlerContext } from "./IBaseHandler";

export type CommandContext<T = CommandInteraction | ContextMenuInteraction> =
  HandlerContext<T>;

class CommandHandler extends BaseHandler<
  CommandInteraction | ContextMenuInteraction
> {
  private permissions: Record<string, ApplicationCommandPermissionData[]> = {};

  public setPermissions(
    command: string,
    permissions?: ApplicationCommandPermissionData[],
  ) {
    if (!permissions) {
      return;
    }

    this.permissions[command] = permissions;
  }

  public getPermissions(
    command: string,
  ): ApplicationCommandPermissionData[] | null {
    if (!this.permissions[command]) {
      return null;
    }

    return this.permissions[command];
  }
}

export default CommandHandler;

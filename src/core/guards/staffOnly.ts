import type { ButtonContext } from "../handler/ButtonHandler";
import type { CommandContext } from "../handler/CommandHandler";

export function staffOnlyGuard<T extends CommandContext | ButtonContext>(
  cb: (ctx: T) => Promise<any>,
): (ctx: T) => Promise<any> {
  return async (ctx: T) => {
    if (!ctx.client.isStaff(ctx.interaction.user.id)) {
      await ctx.interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });

      return;
    }

    return cb(ctx);
  };
}

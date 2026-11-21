import {
  handleMissionCommand,
  handleMissionRouteCommand,
} from "../../common/handlers/mission";
import type { ButtonContext } from "../../core/handler/ButtonHandler";

export const meta = {
  id: "mission",
};

export const handler = async (ctx: ButtonContext) => {
  if (
    ctx.interaction.message.interaction?.user.id !== ctx.interaction.user.id
  ) {
    await ctx.interaction.reply({
      content: "You cannot use this button.",
      ephemeral: true,
    });

    return;
  }

  if (!ctx.uniqueId) {
    await ctx.interaction.reply({
      content: "Button has no unique ID.",
      ephemeral: true,
    });
    return;
  }

  // `${missionLabel}` for the details, `${missionLabel}:${routeKind}` for a route.
  const [label, kind] = ctx.uniqueId.split(":");

  // The routes may need a request to Joe's Blue Archive Tools.
  await ctx.interaction.deferUpdate();

  const response = kind
    ? await handleMissionRouteCommand(label, kind)
    : await handleMissionCommand(label);

  if (!response) {
    await ctx.interaction.followUp({
      content: kind ? "Route not found." : "Mission not found.",
      ephemeral: true,
    });
    return;
  }

  await ctx.interaction.editReply(response);
};

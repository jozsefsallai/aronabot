import { gachaUiHandler } from "./gacha-ui-handler";

const server = Bun.serve({
  routes: {
    "/gacha-ui": gachaUiHandler,
  },

  fetch(_req) {
    return Response.json(
      {
        error: "Not found",
      },
      {
        status: 404,
      },
    );
  },

  port: 8080,
});

console.log(`Server is running on ${server.url}`);

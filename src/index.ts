import Client from "./core/client";

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

const aronabot = new Client();
aronabot.login().catch((err) => {
  console.error("Failed to start AronaBot:", err);
  process.exit(1);
});

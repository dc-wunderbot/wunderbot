import Discord from "discord.js";
import cfg from "config";
import logger from "./helpers/logger";
import MessageHandler from "./handlers/messageHandler";
import DatabaseHandler from "./handlers/databaseHandler";
import EventHandler from "./handlers/EventHandler";

const bot = new Discord.Client();
bot.on("ready", () => {
    logger.info(`Shard has been started successfully!`, { from: `Shard-${bot.shard.id}` });
    const dbHandlr = new DatabaseHandler(bot);
    const msgHandlr = new MessageHandler(bot, dbHandlr);
    const evtHandlr = new EventHandler(bot, dbHandlr);
});

// On joining a new guild send the welcome message and make guild table in db.

bot.login(cfg.get("Bot.token"));

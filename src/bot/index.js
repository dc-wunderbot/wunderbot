import Discord from "discord.js";
import cfg from "config";
import MessageHandler from "./handlers/messageHandler";
import DatabaseHandler from "./handlers/databaseHandler";
import EventHandler from "./handlers/EventHandler";

const client = new Discord.Client();
client.on("ready", () => {
    console.log("I am ready!");
    const dbHandlr = new DatabaseHandler();
    const msgHandlr = new MessageHandler(client, dbHandlr);
    const evtHandlr = new EventHandler(client, dbHandlr);
});

// On joining a new guild send the welcome message and make guild table in db.

client.login(cfg.get("Bot.token"));

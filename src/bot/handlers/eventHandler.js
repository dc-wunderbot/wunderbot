import logger from "winston";

class EventHandler {
    /**
     * Event handler, handles all the events from discord.
     * @param {object} bot - The discord.js bot.
     * @param {object} db - A databaseHandler.
     */
    constructor(bot, db) {
        this.b = bot;
        this.db = db;
        logger.debug("Started EventHandler", { from: `Shard-${bot.shard.id}` });
    }
}

export default EventHandler;

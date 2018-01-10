class EventHandler {
    /**
     * Event handler, handles all the events from discord.
     * @param {object} client - The discord.js client.
     * @param {object} db - A databaseHandler.
     */
    constructor(client, db) {
        this.c = client;
        this.db = db;
        client.on("guildCreate", guild => {
            this.newGuild(guild);
        });
        console.log("EventHandler Started...");
    }

    // On new guild create a database for it
    async newGuild(guild) {
        await this.db.createIfNotExists(guild);
        console.log(`Created database for the guild ${guild.name}`);
    }
}

export default EventHandler;

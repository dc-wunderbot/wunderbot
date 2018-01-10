class Ping {
    /**
     * Command for the bot, sends ping
     * @param {object} client - The discord.js client.
     * @param {object} db - A databaseHandler.
     * @param {object} rDb - Raw rethinkdbdash connection.
     * @param {object} info - Basic information about the plugin, needs to be here for the command importer.
     */
    constructor(discord, bot, db, rDb) {
        this.discord = discord; // Gives us access to discord.js lib
        this.bot = bot; // Gives us access to the bot
        this.db = db; // Gives us access to the dbHandler
        this.rDb = rDb; // Gives us raw rethinkdbdash access for custom database stuff
        this.info = {
            // Information about the command here
            name: "ping",
            bCommand: "ping",
            about: "Sends a ping to the client",
            pm: true
        };
    }

    // Run gets called when command is recognized.
    async run(msg, args) {
        msg.reply("pong");
    }
}

export default Ping;

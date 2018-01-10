class Userinfo {
    /**
     * Command for the bot, sends ping
     * @param {object} client - The discord.js client.
     * @param {object} db - A databaseHandler.
     * @param {object} rDb - Raw rethinkdbdash connection.
     * @param {object} info - Basic information about the plugin, needs to be here for the command importer.
     */
    constructor(discord, bot, db, rDb) {
        this.Discord = discord; // Gives us access to discord.js lib
        this.bot = bot; // Gives us access to the bot
        this.db = db; // Gives us access to the dbHandler
        this.rDb = rDb; // Gives us raw rethinkdbdash access for custom database stuff
        this.info = {
            // Information about the command here
            name: "Me",
            bCommand: "me",
            about: "Sends info about the user to the channel!",
            pm: false
        };
    }

    // Run gets called when command is recognized.
    async run(msg, args) {
        const embed = new this.Discord.RichEmbed()
            .setAuthor(msg.author.username)
            .setDescription("This is the user´s info!")
            .setColor("#9B59B6")
            .addField("Full Username", msg.author.tag)
            .addField("ID", msg.author.id)
            .addField("Created At", msg.author.createdAt);
        msg.channel.send({ embed });
    }
}

export default Userinfo;

import RethinkDb from "rethinkdbdash";
import cfg from "config";

class DatabaseHandler {
    /**
     * Create the database handler, handles all the database integration for
     * the bot.
     */
    constructor() {
        this.db = RethinkDb({
            servers: [cfg.get("Bot.dbConfig")]
        });
        console.log("DatabaseHandler Started...");
    }

    getRawRethink() {
        // Get raw db for commands
        return this.db;
    }

    async cmdIsEnabled(guildId, command) {
        return true;
    }

    async userHasPermission(guildId, guildUser, command) {
        return true;
    }

    async createIfNotExists(guild) {
        this.query = await this.db
            .dbList()
            .contains(guild.id)
            .do(databaseExists =>
                this.db.branch(
                    databaseExists,
                    {
                        dbs_created: 0
                    },
                    this.db.dbCreate(guild.id)
                )
            )
            .run();
        await this.db
            .db(guild.id)
            .tableCreate("settings")
            .run();
        await this.db
            .db(guild.id)
            .table("settings")
            .insert([
                {
                    id: "permissions",
                    permissions: []
                },
                {
                    id: "enabled",
                    enabled: ["ping", "me"]
                }
            ])
            .run();
        return this.query;
    }
}

export default DatabaseHandler;

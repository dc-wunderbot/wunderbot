import RethinkDb from "rethinkdbdash";
import logger from "winston";
import cfg from "config";

class DatabaseHandler {
    /**
     * Create the database handler, handles all the database integration for
     * the bot.
     */
    constructor(bot) {
        this.b = bot;
        this.db = RethinkDb({
            servers: [cfg.get("Bot.dbConfig")],
            log(msg) {
                logger.debug(msg, { from: `Shard-${bot.shard.id}` });
            }
        });
        logger.debug("Started DatabaseHandler", { from: `Shard-${bot.shard.id}` });
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

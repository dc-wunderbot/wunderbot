import Discord from "discord.js";
import logger from "winston";
import cfg from "config";
import fs from "fs";
import path from "path";

const DEFAULT_FAILURE_TIMEOUT = 5000;

class MessageHandler {
    /**
     * Handles all the messages from discord and sends to correct subcommand.
     * @param {object} client - The discord.js client.
     * @param {object} db - A databaseHandler.
     */
    constructor(bot, db) {
        this.bot = bot;
        this.commands = new Map();
        this.db = db;
        this.trigger = cfg.get("Bot.trigger");
        this.bot.on("message", msg => {
            this.handleMsg(msg);
        });
        logger.debug("Started MessageHandler", { from: `Shard-${bot.shard.id}` });
        this.loadCommands();
    }

    loadCommands() {
        fs.readdir(path.join(__dirname, "../cmds"), (err, files) => {
            if (err) console.error(err);

            const jsfiles = files.filter(f => f.split(".").pop() === "js");

            if (jsfiles.length <= 0) {
                console.log("No commands to load!");
                return null;
            }

            console.log(`Loading ${jsfiles.length} commands...`);

            jsfiles.forEach((fileName, i) => {
                import(path.join(__dirname, `../cmds/${fileName}`))
                    .then(commandModule => {
                        let props = new commandModule.default(Discord, this.bot, this.db, this.db.getRawRethink()); // eslint-disable-line
                        this.commands.set(props.info.bCommand, props);
                        console.log(`Successfuly loaded ${this.trigger}${props.info.bCommand}`);
                    })
                    .catch(error => {
                        console.log(`Command located in ${fileName} has failed to load with the error:`);
                        console.log(error);
                    })
            });
        });
    }

    async handleMsg(msg) {
        if (msg.author.bot) return;

        const msgArray = msg.content.split(/\s+/g);
        const command = msgArray[0];
        const args = msgArray.slice(1);

        if (!command.startsWith(this.trigger)) return;

        const cmd = this.commands.get(command.slice(this.trigger.length));

        if (cmd && msg.channel.type === "dm" && !cmd.info.pm) {
            this.noPm(msg);
        } else if (cmd && msg.channel.type === "dm") {
            cmd.run(msg, args);
        } else if (cmd && !await this.db.cmdIsEnabled(msg.guild.id, command.slice(this.trigger.length))) {
            this.notEnabled(msg);
        } else if (
            cmd &&
            !await this.db.userHasPermission(msg.guild.id, msg.member, command.slice(this.trigger.length))
        ) {
            this.noPerm(msg);
        } else if (cmd) {
            cmd.run(msg, args);
        }
    }

    async notEnabled(msg) {
        msg.react("❌");
        const m = await msg.channel.send("❌ That command is not enabled on this server.");
        m.delete(DEFAULT_FAILURE_TIMEOUT);
    }

    async noPerm(msg) {
        msg.react("❌");
        const m = await msg.channel.send("❌ You do not have the rank needed to use this command.");
        m.delete(DEFAULT_FAILURE_TIMEOUT);
    }

    async noPm(msg) {
        msg.react("❌");
        const m = await msg.channel.send("❌ This command can´t be called from PMs.");
        m.delete(DEFAULT_FAILURE_TIMEOUT);
    }
}

export default MessageHandler;

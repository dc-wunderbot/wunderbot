import { ShardingManager } from "discord.js";

const manager = new ShardingManager(`${__dirname}/bot/index.js`, {
    totalShards: 1
});

manager.spawn();

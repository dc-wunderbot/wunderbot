import needle from "needle";
import BlueBird from "bluebird";
import CoinMarket from "../external/coinMarket";

const STATS_URL = CoinMarket.tickerStatsUrl;
const DEFAULT_INCREASE_SYMBOL = ":small_red_triangle:";
const DEFAULT_DECREASE_SYMBOL = ":small_red_triangle_down:";

class Stats {
    /**
     * Constructor for the statistics handler
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
            name: "stats",
            bCommand: "stats",
            about: "Displays stats of current Market stats",
            pm: true
        };
    }

    tripletCommaIndent(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    /* eslint-disable */
    formatReply(apiDataBlock, price_eur, price_gbp) {
        const {
            rank,
            price_usd,
            price_btc,
            market_cap_usd,
            available_supply,
            total_supply,
            percent_change_1h,
            percent_change_24h
        } = apiDataBlock;

        const daily_usd_volume = apiDataBlock["24h_volume_usd"]; // can't begin with a number without quotes

        const hr_indicator = percent_change_1h - 0 > 0 ? DEFAULT_INCREASE_SYMBOL : DEFAULT_DECREASE_SYMBOL;
        const d_indicator = percent_change_24h - 0 > 0 ? DEFAULT_INCREASE_SYMBOL : DEFAULT_DECREASE_SYMBOL;

        const reply =
            `${"**" +
                `Rank: [${rank}](${STATS_URL})` +
                "**" +
                "\n" +
                "**" +
                "Data" +
                "**" +
                "\n" +
                "Market Cap: " +
                `[${this.tripletCommaIndent(market_cap_usd)}](${STATS_URL})` +
                "\n" +
                "Total Supply: " +
                `[${this.tripletCommaIndent(total_supply)}](${STATS_URL})` +
                " LBC" +
                "\n" +
                "Circulating Supply: " +
                `[${this.tripletCommaIndent(available_supply)}](${STATS_URL})` +
                " LBC" +
                "\n" +
                "24 Hour Volume: " +
                `[$ ${this.tripletCommaIndent(daily_usd_volume)}](${STATS_URL})` +
                "\n" +
                "\n" +
                "**" +
                "Price" +
                "**" +
                "\n" +
                `BTC [₿ ${(price_btc - 0).toFixed(8)}](${STATS_URL})` +
                "\n" +
                `USD [$ ${(price_usd - 0).toFixed(2)}](${STATS_URL})` +
                "\n" +
                `EUR [€ ${(price_eur - 0).toFixed(2)}](${STATS_URL})` +
                "\n" +
                `GBP [£ ${(price_gbp - 0).toFixed(2)}](${STATS_URL})` +
                "\n" +
                "\n" +
                "**" +
                "% Change" +
                "**" +
                "\n" +
                `1 Hour: [${percent_change_1h}](${STATS_URL})  `}${hr_indicator}\n` +
            `\n` +
            `24 Hours: [${percent_change_24h}](${STATS_URL})  ${d_indicator}\n`;

        return reply;
    }
    /* eslint-enable */

    async getCMUsdData() {
        return CoinMarket.getTicker("library-credit", "USD");
    }

    async getCMEurData() {
        return CoinMarket.getTicker("library-credit", "EUR");
    }

    async getCMGbpData() {
        return CoinMarket.getTicker("library-credit", "GBP");
    }

    requestBlock() {
        return BlueBird.props({
            usd: this.getCMUsdData(),
            eur: this.getCMEurData(),
            gbp: this.getCMGbpData()
        });
    }

    async run(msg, args) {
        const { usd, eur, gbp } = await this.requestBlock();

        const latestUpdate = new Date(usd.body[0].last_updated * 1000).toUTCString();

        if (usd.statusCode === 200) {
            const price_eur = eur.body[0].price_eur; // eslint-disable-line
            const price_gbp = gbp.body[0].price_gbp; // eslint-disable-line

            const embed = {
                description: this.formatReply(usd.body[0], price_eur, price_gbp),
                color: 7976557,
                footer: {
                    text: `Last Updated: ${latestUpdate}`
                },
                author: {
                    name: "Coin Market Cap Stats (LBC)",
                    url: STATS_URL,
                    icon_url: "https://i.imgur.com/yWf5USu.png"
                }
            };
            msg.channel.send({ embed });
        } else {
            msg.reply("CoinMarket API not available");
        }
    }
}

export default Stats;

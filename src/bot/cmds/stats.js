import needle from "needle";
import BlueBird from "bluebird";
import CoinMarket from "../external/coinMarket";
import dqi from "../helpers/discordQueryInterface";

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

        return dqi
            .bold("Rank: " + dqi.url(rank, STATS_URL))
            .newLine()
            .bold("Data")
            .newLine()
            .line("Market Cap: " + dqi.url(this.tripletCommaIndent(market_cap_usd), STATS_URL))
            .line("Total supply: " + dqi.url(this.tripletCommaIndent(total_supply), STATS_URL))
            .line("Circulating supply: " + dqi.url(this.tripletCommaIndent(available_supply), STATS_URL) + " LBC")
            .line("24 hour volume: " + dqi.url(this.tripletCommaIndent(daily_usd_volume), STATS_URL))
            .newLine()
            .bold("Price")
            .newLine()
            .line("BTC " + dqi.url(`${dqi.btc} ${(price_btc - 0).toFixed(8)}`, STATS_URL))
            .line("USD " + dqi.url(`$ ${(price_usd - 0).toFixed(2)}`, STATS_URL))
            .line("EUR " + dqi.url(`${dqi.eur} ${(price_eur - 0).toFixed(2)}`, STATS_URL))
            .line("GBP " + dqi.url(`${dqi.gbp} ${(price_gbp - 0).toFixed(2)}`, STATS_URL))
            .newLine()
            .bold("% change")
            .newLine()
            .line(`1 Hour: [${percent_change_1h}](${STATS_URL})  ${hr_indicator}`)
            .line(`24 Hours: [${percent_change_24h}](${STATS_URL})  ${d_indicator}`)
            .toString();
    }
    /* eslint-enable */
    requestBlock() {
        return BlueBird.props({
            usd: CoinMarket.getTicker("library-credit", "USD"),
            eur: CoinMarket.getTicker("library-credit", "EUR"),
            gbp: CoinMarket.getTicker("library-credit", "GBP")
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

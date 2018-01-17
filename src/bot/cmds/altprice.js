import CryptoCompare from "../external/cryptoCompare";
import dqi from "../helpers/discordQueryInterface";

class AltPrice {
    /**
     * Altprice
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
            name: "altprice",
            bCommand: "altprice",
            about: "display price of specified alt coin from crypto compare",
            pm: true
        };
    }

    // Run gets called when command is recognized.
    async run(msg, args) {
        // TODO: Add validation here

        const now = new Date();

        let currencyFrom = "";
        let currencyTo = "BTC";
        let amount = 0;

        currencyFrom = args[0].toUpperCase()
        
        if(args[1] !== undefined){
            currencyTo = args[1].toUpperCase()
        }

        if (this.getValidatedAmount(args[2]) === null) {
            msg.reply("Please specify a number for <amount>");
            return;
        }
        
        amount = args[2] - 0;

        const cryptoCompareData = await CryptoCompare.getPrice(currencyFrom, currencyTo);
        const price = cryptoCompareData.body[currencyTo] - 0;

        msg.reply(
            dqi
                .line(`${amount} ${currencyFrom} = ${amount * price} ${currencyTo}`)
                .std(`Updated: [UTC] ${now.toUTCString()}`)
                .toString()
        );
    }
    getValidatedAmount(amount) {
        const trimmed = amount.trim();
        return trimmed.match(/^[0-9]+(\.[0-9]+)?$/) ? amount : null;
    }
}

export default AltPrice;

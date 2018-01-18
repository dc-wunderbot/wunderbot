import needle from "needle";

const STATS_URL = "https://api.coinmarketcap.com/v1/ticker/library-credit/";

class CoinMarket {
    constructor() {
        this.tickerStatsUrl = STATS_URL;
    }

    async getTicker(coin, fiat = "USD") {
        if (fiat === "USD") return needle("get", STATS_URL);
        return needle("get", `${STATS_URL}?convert=${fiat}`);
    }
}

export default new CoinMarket();

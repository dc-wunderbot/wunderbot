import needle from "needle";

const ALL_COIN_LIST = "https://min-api.cryptocompare.com/data/all/coinlist";
const PRICE_URL = "https://min-api.cryptocompare.com/data/price";

class CryptoCompare {
    constructor() {
        this.allCoinList = ALL_COIN_LIST;
        this.priceUrl = PRICE_URL;
    }

    async getAllCoinsList(coin, fiat = "USD") {
        return needle("get", ALL_COIN_LIST);
    }
    async getPrice(from = "BTC", to = "USD") {
        return needle("get", `${PRICE_URL}?fsym=${from}&tsyms=${to}`);
    }
}

export default new CryptoCompare();

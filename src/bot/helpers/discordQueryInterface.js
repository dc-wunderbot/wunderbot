class DiscordQueryInterface {
    constructor() {
        this.query = "";
        this.btc = "₿";
        this.eur = "€";
        this.gbp = "£";
    }
    std(query) {
        this.query += query;
        return this;
    }
    bold(query) {
        this.query += `**${query}**`;
        return this;
    }
    url(query, url) {
        return `[${query}](${url})`;
    }
    newLine() {
        this.query += "\n";
        return this;
    }
    doubleNewLine() {
        this.query += "\n\n";
        return this;
    }
}

DiscordQueryInterface.prototype.toString = function(){
    const { query } = this;
    this.query = "";
    return query;
}

export default new DiscordQueryInterface();

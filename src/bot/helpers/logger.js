import winston from "winston";
import cfg from "config";
import wcf from "winston-console-formatter";
import wdrf from "winston-daily-rotate-file";

const { formatter, timestamp } = wcf();
winston.clear();
winston.add(winston.transports.Console, {
    level: cfg.get("Bot.logLevel"),
    formatter,
    timestamp
});
winston.add(wdrf, {
    filename: "./log",
    dirname: "./logs",
    datePattern: "yyyy-MM-dd.",
    prepend: true,
    level: cfg.get("Bot.logLevel")
});

export default winston;

const winston = require("winston");

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors:{
        fatal: "red",
        error: "orange",
        warning: "yellow",
        info: "blue",
        http: "green",
        debug: "brown"
    }
}



const logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level:"info",
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: `${process.cwd()}/src/files/logs/errors.log`,
            level:"warning",
            format: winston.format.simple()
        }),

    ]
});

const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleString()}`)
    next();
}

module.exports = addLogger
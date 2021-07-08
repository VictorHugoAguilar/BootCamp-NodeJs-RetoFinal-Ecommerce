const appRoot = require('app-root-path');
const winston = require('winston');
const morgan = require('morgan');

const { format, transports, createLogger } = winston;

const options = {
    fileInfo: {
        level: 'info',
        filename: `${appRoot}/server/logs/log-info.log
`,
        handleExceptions: true,
        format: format.json(),
        maxsize: 10485760, // 10 MB
        maxFiles: 5,
    },
    fileWarn: {
        level: 'warn',
        filename: `${appRoot}/server/logs/log-warn.log
    `,
        handleExceptions: true,
        format: format.json(),
        maxsize: 10485760, // 10 MB
        maxFiles: 5,
    },
    console: {
        level: 'silly',
        handleExceptions: true,
        format: format.combine(
            format.colorize(),
            format.simple()
        )
    }
};

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: 'back-end-ecommerce' },
    transports: [
        new transports.File(options.fileInfo),
        //Info includes HTTP requests
        new transports.File(options.fileWarn),
        // Without HTTP logs
        new transports.Console(options.console)
    ],
    exitOnError: false,
});

logger.stream = {
    write: function(message, encoding) {
        logger.info(message);
    }
};

module.exports = logger;

/*
module.exports = morgan('combined', {
    stream: logger.stream
});
*/
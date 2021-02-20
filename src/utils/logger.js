
require('winston-daily-rotate-file')
const moment = require('moment-timezone')
const winston = require('winston')

/**
 * @param  {Object} params
 * @param  {Object} params.appdetails
 */
const init = (params) => {
    moment.tz.setDefault('Asia/Jakarta')

    const appdetails = params.appdetails || {}
    const syslogger = winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({
                message,
                timestamp,
            }) => JSON.stringify({
                timestamp,
                ...message,
            })),
        ),
        transports: [
            new winston.transports.DailyRotateFile({
                dirname: 'logs',
                filename: 'sys.log.%DATE%',
                datePattern: 'YYYYMMDD',
                zippedArchive: true,
                maxSize: '50m',
                maxFiles: '14d',
            }),
        ],
    })

    return {
        log: (data, verbose = false) => {
            // format if data is string
            if (typeof data == 'string') data = {
                msg: data,
            }

            // commit log
            syslogger.info({
                ...appdetails,
                ...data,
            })

            // log to stdout if set to be verbose
            if (verbose && data.msg) console.log(new Date(), data.msg)
        },
    }
}

module.exports = {
    init: init,
}
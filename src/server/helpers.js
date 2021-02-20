
const deps = require('./deps')
const logger = deps.logger

module.exports.pathNotFoundHandler = () => {
    return async (req, res, next) => {
        const msg = 'cannot find route: ' + `${req.method} ${req.originalUrl}`
        const err = new Error(msg)
        next(err)
    }
}

module.exports.errorHandler = () => {
    return async (err, req, res, next) => { // eslint-disable-line no-unused-vars
        // log errors
        console.log(err)

        // handle unexpected errors
        logger.log({
            tag: 'unhandled error',
            msg: `unhandled error @${req.method} ${req.originalUrl}`,
            data: {
                message: err.message,
                stack: err.stack,
            },
            metaData: req.headers['correlation-id'],
        })

        const response = {
            message: 'unexpected error' + (process.env.MODE == 'production' ? '' : `: ${err.message}`),
        }

        return res.json(response)
    }
}
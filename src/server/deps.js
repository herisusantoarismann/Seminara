const config = require('../config')
const utils = require('../utils')
const { init: initGreeter } = require('../services/greeter')

// dependencies
const logger = utils.logger.init({})
const greeter = initGreeter({
    name: config.env.appname,
})

module.exports = {
    prepare: async () => { },
    logger,
    greeter,
}
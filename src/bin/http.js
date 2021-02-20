require('dotenv').config()

const api = require('../server')
const config = require('../config')

const cfgenv = config.env

process.env.NODE_PATH = __dirname

async function startServer() {
    console.log(`starting up ${cfgenv.appname}...`)
    console.log(`using config: ${JSON.stringify(cfgenv)}`)

    // initialize dependencies
    await api.deps.prepare()
    console.log('dependency initialized')

    // run server
    const server = api.server()
    server.listen(cfgenv.server.port, () => console.log(`server started on port ${cfgenv.server.port} \n!-`))
}

startServer()
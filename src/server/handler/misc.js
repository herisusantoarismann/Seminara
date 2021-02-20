const deps = require('../deps')

module.exports = () => {
    return {
        GreetV1: async (req, res) => {
            const message = await deps.greeter.sayHello()

            res.json({
                message: message,
            })
        },
    }
}
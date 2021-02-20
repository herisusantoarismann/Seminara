
/**
 * @param  {Object} params
 * @param  {String} params.name
 */
const init = (params) => {

    const initparams = params

    return {
        sayHello: async () => {
            return 'hello ' + initparams.name
        },
    }
}

module.exports = {
    init,
}
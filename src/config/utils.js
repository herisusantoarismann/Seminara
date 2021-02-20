module.exports = {
    /**
     * @param  {String} value
     * @param  {String} defaultValue
     */
    normalize: (value, defaultValue = '') => {
        value = value || defaultValue
        if (!value) throw new Error('invalid final value')
        return value
    },
}
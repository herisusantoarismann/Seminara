
module.exports = {
    asyncHandler: (handler) => async function (req, res, next) {
        handler(req, res, next).catch(next)
    },
}
const response = require('../../network/response')
const Auth = require('../../util/services/Auth')

exports.checkAuth = (action) => {
    async function authMiddleWare(req, res, next) {
        try {
            const token = Auth.decodeAuthorization(req)
            const payload = Auth.verifyAndDecryptToken(token)

            switch (action) {
                case 'assignProperty':
                    if (Auth.isAdmin(payload.rol)) {
                        throw {
                            message: `You're admin so you can't do anything in carts`,
                            code: 401
                        }
                    }
                    req.body.user = payload.sub
                    next()
                    break

                default:
                    next()
            }
        } catch (error) {
            console.error(error)
            response.error(res, error.code, error.extraInfo)
        }
    }

    return authMiddleWare
}

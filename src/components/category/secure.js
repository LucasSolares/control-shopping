const response = require('../../network/response')
const Auth = require('../../util/services/Auth')

exports.checkAuth = (action) => {
    async function authMiddleWare(req, res, next) {
        try {
            const token = Auth.decodeAuthorization(req)
            const payload = Auth.verifyAndDecryptToken(token)

            switch (action) {
                case 'checkRol':
                    if (!Auth.isAdmin(payload.rol)) {
                        throw {message: `You're not admin so you can't create, delete or update category`, code: 401}
                    }
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

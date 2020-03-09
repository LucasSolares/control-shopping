const response = require('../../network/response')
const Auth = require('../../util/services/Auth')

exports.checkAuth = (action) => {
    async function authMiddleWare(req, res, next) {
        try {
            const token = Auth.decodeAuthorization(req)
            const payload = Auth.verifyAndDecryptToken(token)

            switch (action) {
                case 'listBills':
                    const { user } = req.body
                    if(user) {
                        if(!Auth.isAdmin(payload.rol)) {
                            if(!Auth.checkOwn(payload.sub, user)) {
                                throw {message: 'You only can see your bills', code: 401}
                            }
                        }
                    } else {
                        if(!Auth.isAdmin(payload.rol)) {
                            throw {message: `You can't see bills of other persons`, code: 401}
                        }
                    }
                    next()
                    break

                case 'createBill':
                    if(Auth.isAdmin(payload.rol)) {
                        throw {message: `You're admin you can't create bills`, code: 401}
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

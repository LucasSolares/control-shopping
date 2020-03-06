const response = require('../../network/response')
const Auth = require('../../util/services/Auth')
const Store = require('./store')
const { Rol } = require('../../util/enums')

exports.checkAuth = (action) => {
    async function authMiddleWare(req, res, next) {
        const { _id, rol } = req.body
        try {
            const token = Auth.decodeAuthorization(req)
            const payload = Auth.verifyAndDecryptToken(token)

            switch (action) {
                case 'update':
                    if (!_id) {
                        throw { message: 'Missing _id', code: 400 }
                    }
                    if (!Auth.isAdmin(payload.rol)) {
                        if (rol) {
                            throw {message: `Is client so can't edit his rol`, code: 400, extraInfo: `You're client can't edit your rol`}
                        }
                        if (!Auth.checkOwn(payload.sub, _id)) {
                            throw { message: 'This is not your id', code: 401 }
                        }
                    }
                    if (Auth.checkOwn(payload.sub, _id)) {
                        next()
                        return
                    }
                    const userWantedToEdit = (await Store.listCredentials({_id})).pop()
                    if(userWantedToEdit.rol === Rol.Admin) {
                        throw {message: `You try to edit an admin and you can't do that`, code: 401}
                    }
                    next()
                    break
                case 'list':
                    if (!Auth.isAdmin(payload.rol)) {
                        throw {message: `You can't list users if you are not admin`, code: 401}
                    }
                    next()
                    break
                case 'delete':
                    if (!_id) {
                        throw { message: 'Missing _id', code: 400 }
                    }
                    if (!Auth.isAdmin(payload.rol)) {
                        if (!Auth.checkOwn(payload.sub, _id)) {
                            throw { message: 'This is not your id', code: 401 }
                        }
                    }
                    if (Auth.checkOwn(payload.sub, _id)) {
                        next()
                        return
                    }
                    const userWantedToDelete = (await Store.listCredentials({_id})).pop()
                    if(!userWantedToDelete) {
                        throw {message: `User with id ${_id} not found`, code: 404}
                    }
                    if(userWantedToDelete.rol === Rol.Admin) {
                        throw {message: `You try to delete an admin and you can't do that`, code: 401}
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

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const config = require('../../config')
const { Rol } = require('../enums')

const hashPassword = async (unHashedPassword) => {
    const SALT = await bcrypt.genSalt(parseInt(config.SALT))
    return await bcrypt.hash(unHashedPassword, SALT)
}

const comparePassword = async (unHashedPassword, hashedPassword) =>
    await bcrypt.compare(unHashedPassword, hashedPassword)

const generateAndSignToken = (payload) =>
    jwt.sign(payload, config.SECRET, { expiresIn: '1h' })

const verifyAndDecryptToken = (token) => {
    try {
        return jwt.verify(token, config.SECRET)
    } catch (error) {
        switch (error.message) {
            case 'jwt expired':
                throw { message: 'Token expired', code: 401 }

            default:
                throw error
        }
    }
}

const decodeAuthorization = (req) => {
    const authorization = req.headers.authorization || ''
    const token = authorization.replace(/['"]+/g, '')
    if (!token) {
        throw { message: 'You dont send any token', code: 401 }
    }
    return token
}

const checkOwn = (sub, _id) => sub === _id

const isAdmin = (rol) => rol === Rol.Admin

module.exports = {
    hashPassword,
    comparePassword,
    generateAndSignToken,
    verifyAndDecryptToken,
    decodeAuthorization,
    checkOwn,
    isAdmin
}

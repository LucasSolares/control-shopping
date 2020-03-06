const Store = require('./store')
const { Rol } = require('../../util/enums')

const Auth = require('../../util/services/Auth')

async function hackMatrix() {

    try {
        const hashedPassword = await Auth.hashPassword('admin')
        return await Store.signUp({email: 'admin@root.kinal.edu', password: hashedPassword, rol: 'admin', user: {name: 'Admin', lastName: 'Root', NIT: 'INFINITO', address: 'MI CASA'}})
         
    } catch (error) {
        console.error(error)
        throw error
    }

}

async function signUp(email = '', password = '', rol, name = '', lastName = '', NIT = '', address = '') {

    try {
        email = email.trim().toLowerCase()
        password = password.trim()
        name = name.trim()
        lastName = lastName.trim()
        NIT = NIT.trim()
        address = address.trim()
        if(!(email && password && name && lastName && NIT && address)) {
            throw {message: 'Missing data something email, password, rol, name, lastName, NIT or address', code: 400}
        }
        if(rol) {
            rol = rol.trim()
            if(!(rol === Rol.Admin || rol === Rol.Client)) {
                throw {message: `The rol ${rol} is not implemented yet`, code: 400}
            }
        }
        const hashedPassword = await Auth.hashPassword(password)
        return (await Store.signUp({email, password: hashedPassword, rol, user: {name, lastName, NIT, address}})).user
    } catch (error) {
        console.error(error)
        throw error
    }

}

async function signIn(email = '', password = '') {

    try {
        email = email.trim()
        password = password.trim()
        if(!(email && password)) {
            throw {message: 'Missing data something like email or password', code: 400}
        }
        const credential = await Store.signIn(email)
        const passwordCorrect = await Auth.comparePassword(password, credential.password)
        if(!passwordCorrect) {
            throw {message: 'Incorrect password', code: 401}
        }
        return Auth.generateAndSignToken({sub: credential._id, rol: credential.rol})
    } catch (error) {
        console.error(error)
        throw error
    }

}

async function updateCredential(_id, email = '', password = '', rol, name = '', lastName = '', NIT = '', address = '') {

    let credentialToUpdate = {}
    let userToUpdate = {}

    try {
        email = email.trim().toLowerCase()
        password = password.trim()
        name = name.trim()
        lastName = lastName.trim()
        NIT = NIT.trim()
        address = address.trim()
        if(rol) {
            rol = rol.trim()
            if(!(rol === Rol.Admin || rol === Rol.Client)) {
                throw {message: `The rol ${rol} is not implemented yet`, code: 400}
            }
        }
        if(_id) {
            if (email) {
                credentialToUpdate.email = email
            }
            if (password) {
                credentialToUpdate.password = await Auth.hashPassword(password)
            }
            if (rol) {
                credentialToUpdate.rol = rol
            }
            if (name) {
                userToUpdate['user.name'] = name
            }
            if (lastName) {
                userToUpdate['user.lastName'] = lastName
            }
            if (NIT) { 
                userToUpdate['user.NIT'] = NIT
            }
            if(address) {
                userToUpdate['user.address'] = address
            }
            if(Object.keys(userToUpdate).length != 0) {
                credentialToUpdate.$set = userToUpdate 
            }
            if (Object.keys(credentialToUpdate).length != 0) {
                return (await Store.updateCredential(_id, credentialToUpdate)).user
            }
        }
        throw {message: 'Missing data something _id, email, password, rol, name, lastName, NIT or address', code: 400}
    } catch (error) {
        console.error(error)
        throw error
    }

}

async function deleteCredential(_id) {

    try {
        if(!_id) {
            throw {message: 'Missing data something _id'}
        }
        return (await Store.deleteCredential(_id)).user
    } catch (error) {
        console.error(error)
        throw error
    }

}

async function listCredentials() {

    let filter = {}

    try {
        return await Store.listCredentials(filter)
    } catch (error) {
        console.error(error)
        throw error
    }

}

module.exports = 
{
    signUp,
    signIn,
    updateCredential,
    deleteCredential,
    listCredentials,
    hackMatrix
}
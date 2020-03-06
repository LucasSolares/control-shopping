const Model = require('./model')

exports.signUp = async (credential) => {
    try {
        const userAlreadyExists = await Model.findOne({ email: credential.email })
        if (userAlreadyExists) {
            throw {
                message: `The email ${credential.email} is already taken`,
                code: 400,
                extraInfo: 'The email is already taked'
            }
        }
        const credentialToAdd = new Model(credential)
        return await credentialToAdd.save()
    } catch (error) {
        console.error(error)
        throw error
    }
}

exports.signIn = async (email) => {
    try {
        const userExists = await Model.findOne({ email }, { email: 1, password: 1, rol: 1 })
        if (!userExists) {
            throw { message: `User with email ${email} not founded`, code: 401 }
        }
        return userExists
    } catch (error) {
        console.error(error)
        throw error
    }
}

exports.deleteCredential = async (_id) => {
    try {
        const credentialDeleted = await Model.findByIdAndDelete(_id)
        if (!credentialDeleted) {
            throw { message: `User with id ${_id} not founded`, code: 404 }
        }
        return credentialDeleted
    } catch (error) {
        console.error(error)
        throw error
    }
}

exports.updateCredential = async (_id, credentialToUpdate) => {
    try {
        const credentialUpdated = await Model.findOneAndUpdate(_id, credentialToUpdate, {new: true})
        if (!credentialUpdated) {
            throw { message: `User with id ${_id} not founded`, code: 404 }
        }
        return credentialUpdated
    } catch (error) {
        console.error(error)
        throw error
    }
}

exports.listCredentials = async (filter) => {
    try {
        return await Model.find(filter)
    } catch (error) {
        console.error(error)
        throw error
    }
}

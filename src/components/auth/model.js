const mongoose = require('mongoose')

const { Rol } = require('../../util/enums')

const Schema = mongoose.Schema

const schema = new Schema({
    email: String,
    password: String,
    rol: {
        type: String,
        enum: Object.values(Rol),
        default: Rol.Client
    },
    user: {
        name: String,
        lastName: String,
        NIT: String,
        address: String
    }
})

module.exports = mongoose.model('auth', schema)

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
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
})

module.exports = mongoose.model('auth', schema)
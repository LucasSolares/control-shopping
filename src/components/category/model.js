const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
    name: String,
    cuantity_products: {
        type: Number,
        required: true,
        default: 0
    }
})

module.exports = mongoose.model('category', schema)

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
    name: String,
    description: String,
    cuantity: {
        type: Number,
        required: true,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    sales: {
        type: Number,
        required: true,
        default: 0
    },
    price: Number,
})

module.exports = mongoose.model('product', schema)

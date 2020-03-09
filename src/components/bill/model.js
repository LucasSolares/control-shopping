const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autoIncrement = require('mongoose-auto-increment')

const schema = new Schema({
    date: Date,
    no_bill: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    products: [
        {
            product_id: Schema.Types.ObjectId,
            name: String,
            subtotal: Number,
            cuantity: Number
        }
    ],
    total: Number,
    url: {
        type: String,
        required: false,
    }
})

autoIncrement.initialize(mongoose.connection)
schema.plugin(autoIncrement.plugin, {model: 'bill', field: 'no_bill', startAt: 1})

module.exports = mongoose.model('bill', schema)

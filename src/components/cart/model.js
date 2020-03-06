const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'auth',
        required: true,
    },
    products: [
        {
            product_id: Schema.Types.ObjectId,
            name: String,
            price: Number,
            cuantity: Number
        }
    ]
})

module.exports = mongoose.model('cart', schema)
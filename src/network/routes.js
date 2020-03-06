// const productRouter = require('../components/product/network')
const pruebaBill = require('../components/bill/index')

exports.createRouting = (app) => {
    // app.use('/product', productRouter)
    app.use('/bill', pruebaBill)
}
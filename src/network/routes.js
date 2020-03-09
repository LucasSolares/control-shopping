const productsRouter = require('../components/product/network')
const routerAuths = require('../components/auth/network')
const routerCategories = require('../components/category/network')
const routerCart = require('../components/cart/network')
const routerBill = require('../components/bill/network')

exports.createRouting = (app) => {
    app.use('/product', productsRouter)
    app.use('/auth', routerAuths)
    app.use('/category', routerCategories)
    app.use('/cart', routerCart)
    app.use('/bill', routerBill)
}
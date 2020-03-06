// const productRouter = require('../components/product/network')
const routerAuths = require('../components/auth/network')

exports.createRouting = (app) => {
    // app.use('/product', productRouter)
    app.use('/auth', routerAuths)
}
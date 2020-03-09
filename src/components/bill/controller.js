const Store = require('./store')
const StoreCarts = require('../cart/store')
const StoreProducts = require('../product/store')
const StoreUsers = require('../auth/store')

const Model = require('./model')

const PDF = require('../../util/services/PDF')
const Context = require('../../util/models/Context')


async function createBill(user) {
    try {
        if(!user) {
            throw {message: 'Missing data something like user', code: 400}
        }

        let userFinded = await StoreUsers.listCredentials({_id: user})
        if(!userFinded) {
            throw {message: 'User not exists', code: 404}
        }
        userFinded = userFinded.pop()
        const context = new Context()

        const cartToBuy = await StoreCarts.showCart(user)
        if (!cartToBuy) {
            throw {message: `You don't have a cart`, code: 404}
        }
        let productsToBuy = []
        let total = 0

        for( let i = 0; i < cartToBuy.products.length; i++) {
            const productFinded = (await StoreProducts.listProducts({_id: cartToBuy.products[i].product_id})).pop()
            if(productFinded.cuantity < cartToBuy.products[i].cuantity) {
                throw {message: `Sorry you're trying to buy too much items and don't have in the store`, code: 400}
            }
            await StoreProducts.updateProduct({_id: cartToBuy.products[i].product_id, toUpdate: {$inc: {sales: cartToBuy.products[i].cuantity, cuantity: cartToBuy.products[i].cuantity * -1}}})
            productsToBuy.push({
                cuantity: cartToBuy.products[i].cuantity,
                name: cartToBuy.products[i].name,
                subtotal: cartToBuy.products[i].cuantity * cartToBuy.products[i].price,
            })
            total = total + (cartToBuy.products[i].cuantity * cartToBuy.products[i].price)
        }

        if (productsToBuy.length === 0) {
            throw {message: `You don't have any product in your cart`, code: 400}
        }

        const billCreated = await Store.createBill({date: Date.now(), user, products: productsToBuy, total: total})
        context.address = userFinded.user.address
        context.date = billCreated.date
        context.name = userFinded.user.name
        context.nit = userFinded.user.NIT
        context.no_bill = billCreated.no_bill
        context.products = productsToBuy
        context.total = total

        await StoreCarts.buyItemsOnCart(user)

        const URLBill = await PDF.createPDF(context.toHandleBars(), user, 'bill.hbs')

        await Model.updateOne({_id: billCreated._id}, {url: URLBill})

        return URLBill

    } catch (error) {
        console.error(error)
        throw error
    }
}

async function listBills(user) {

    let filter = {}

    try {
        if(user) {
            filter.user = user
        }
        return await Store.listBills(filter)
    } catch (error) {
        console.error(error)
        throw error
    }
}

module.exports =
{
    createBill,
    listBills
}
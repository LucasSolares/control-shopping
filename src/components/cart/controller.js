const Store = require('./store')
const StoreProducts = require('../product/store')

async function addProductToCart(user, product, cuantity) {
    try {
        const productToAdd = (await StoreProducts.listProducts({ _id: product })).pop()
        if (!(user, product)) {
            throw { message: 'Missing data something like user or product', code: 400 }
        }
        if (!cuantity) {
            cuantity = 1
        }
        if (!productToAdd) {
            throw { message: `That product not exists`, code: 404 }
        }
        const cartWithProductAdded = await Store.addProductToCart(user, {
            product_id: productToAdd._id,
            name: productToAdd.name,
            price: productToAdd.price,
            cuantity
        })
        return cartWithProductAdded
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function removeProductFromCart(user, product, cuantity, full) {
    try {
        if (!(user, product)) {
            throw { message: 'Missing data something like user or product', code: 400 }
        }
        if (!cuantity) {
            cuantity = 1
        }
        const productFinded = (await StoreProducts.listProducts({ _id: product })).pop()
        if (!productFinded) {
            throw { message: `That product not exists`, code: 404 }
        }
        const cartWithProductRemoved = await Store.removeProductFromCart(
            user,
            {
                product_id: productFinded._id,
                name: productFinded.name,
                price: productFinded.price,
                cuantity: cuantity * -1
            },
            full
        )
        return cartWithProductRemoved
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function showCart(user) {
    try {
        if (!user) {
            throw { message: 'Missing data something like user or product', code: 400 }
        }
        const userCart = await Store.showCart(user)
        if (!userCart) {
            throw { message: 'User not have a cart yet', code: 404 }
        }
        return userCart
    } catch (error) {
        console.error(error)
        throw error
    }
}

module.exports = {
    addProductToCart,
    removeProductFromCart,
    showCart
}

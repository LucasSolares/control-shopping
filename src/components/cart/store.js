const Model = require('./model')

exports.addProductToCart = async (user, product) => {

    try {
        const cartAlreadyExists = await Model.findOne({user})
        if(!cartAlreadyExists) {
            const cartToAdd = new Model({user})
            await cartToAdd.save()
        }
        const productAlreadyExistsOnCart = await Model.findOne({user, products: { $elemMatch: {product_id: product.product_id} }})
        if(productAlreadyExistsOnCart) {
            return await Model.findOneAndUpdate({user, 'products.product_id': product.product_id}, {$inc: {'products.$.cuantity': product.cuantity}}, {new: true})
        }
        return await Model.findOneAndUpdate({user}, {$push: {products: product}}, {new: true})
    } catch (error) {
        console.error(error)
        throw error
    }

}

exports.buyItemsOnCart = async (user) => {

    try {
        const userCart = await Model.findOne({user})
        if(!userCart) {
            throw {message: `You don't have any cart`, code: 400}
        }
        if(userCart.products.length === 0) {
            throw {message: `You're cart don't have any product`, code: 400}
        }
        await Model.findOneAndUpdate({user}, { products: [] }, {new: true})
        return userCart.products
    } catch (error) {
        console.error(error)
        throw error
    }

}


exports.removeProductFromCart = async (user, product, full) => {
    try {
        let productAlreadyExistsOnCart = await Model.findOne({user, 'products.product_id': product.product_id}, {'products.$': 1})
        if(productAlreadyExistsOnCart) {
            productAlreadyExistsOnCart = productAlreadyExistsOnCart.products.pop()
            if(productAlreadyExistsOnCart.cuantity < product.cuantity) {
                throw {message: `You don't have sufficients product on your cart`}
            }
            console.log(productAlreadyExistsOnCart.cuantity)
            console.log(product.cuantity)
            if (full || (productAlreadyExistsOnCart.cuantity + product.cuantity) <= 0) {
               return await Model.findOneAndUpdate({user}, {$pull: {products: {'product_id': product.product_id}}}, {new: true})
            }
            return await Model.findOneAndUpdate({user, 'products.product_id': product.product_id}, {$inc: {'products.$.cuantity': product.cuantity}}, {new: true})
        }
        throw {message: 'The item not exists in your car', code: 400}
    } catch (error) {
        console.error(error)
        throw error
    }
}

exports.showCart = async (user) => {
    try {
        return await Model.findOne({user})
    } catch (error) {
        console.error(error)
        throw error
    }
}
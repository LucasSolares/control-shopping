const Model = require('./model')

exports.getUserCart = async (user) => {

    try {
        return await Model.findOne({user})
    } catch (error) {
        console.error(error)
        throw error
    }

}

exports.addProductToCart = async (user, product) => {

    try {
        const productAlreadyExistsOnCart = await Model.findOne({user, products: { $elemMatch: {product_id: product} }})
        if(productAlreadyExistsOnCart) {
            return await Model.findByOneAndUpdate({user, 'products.product_id': product.product_id}, {$inc: {'products.$.cuantity': 1}})
        }
        return await Model.updateOne({user}, {$push: {products: product}})
    } catch (error) {
        console.error(error)
        throw error
    }

}

exports.removeProductOfCart = async (user, product, full) => {

    try {
        const productAlreadyExistsOnCart = await Model.findOne({user, products: { $elemMatch: {product_id: product} }})
        if(productAlreadyExistsOnCart) {
            
        }
    } catch (error) {
        console.error(error)
        throw error
    }

}
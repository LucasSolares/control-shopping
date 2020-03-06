const Store = require('./store')
const StoreCategories = require('../category/store')

async function createProduct(name = '', description = '', cuantity, category, price) {
    try {
        name = name.trim()
        description = description.trim()
        if (!(name && description && category && price)) {
            throw {
                message:
                    'Missing data something like name, description, category or price',
                    code: 400
            }
        }
        const categoryExists = (
            await StoreCategories.listCategories({ _id: category })
        ).pop()
        if (!categoryExists) {
            throw { message: `Category with id ${category} not found`, code: 404 }
        }
        const productAdded = await Store.createProduct({
            name,
            description,
            category,
            price,
            cuantity
        })
        await StoreCategories.updateCategory(category, { $inc: { cuantity_products: 1 } })
        return productAdded
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function listProducts(category, name = '', orderBy, outOfStock) {
    let filter = {}
    let options = {}
    try {
        name = name.trim()

        if (orderBy) {
            options.orderBy = orderBy
        } else if (category) {
            filter.category = category
        } else if (name) {
            filter.name = { $regex: `.*${name}.*` }
        } else if (outOfStock) {
            filter.cuantity = 0
        }
        return await Store.listProducts(filter, options)
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function updateProduct(
    _id,
    name = '',
    description = '',
    cuantity,
    category,
    sales,
    price
) {
    let productToUpdate = {}

    try {
        name = name.trim()
        description = description.trim()

        if (_id) {
            if (name) {
                productToUpdate.name = name
            }
            if (description) {
                productToUpdate.description = description
            }
            if (cuantity) {
                productToUpdate.cuantity = cuantity
            }
            if (category) {
                productToUpdate.category = category
            }
            if (sales) {
                productToUpdate.sales = sales
            }
            if (price) {
                productToUpdate.price = price
            }
            if (Object.values(productToUpdate).length !== 0) {

                let productUpdated
                if(category) {
                    const productWithPreviousCategory = await Store.updateProduct({ _id, toUpdate: productToUpdate })
                    await StoreCategories.updateCategory(productWithPreviousCategory.category, {$inc: {cuantity_products: -1}})
                    await StoreCategories.updateCategory(category, {$inc: {cuantity_products: 1}})
                    productUpdated = (await Store.listProducts({_id})).pop()
                } else {
                    productUpdated = await Store.updateProduct({ _id, toUpdate: productToUpdate, wantNew: true })
                }

                return productUpdated
            }
        }

        throw {
            message:
                'Missing data something like _id, name, description, cuantity, category or price',
            code: 400
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function deleteProduct(_id) {
    try {
        const productDeleted = await Store.deleteProduct(_id)
        if (!productDeleted) {
            throw { message: `Product with id ${_id} not found`, code: 404 }
        }
        await StoreCategories.updateCategory(productDeleted.category, {
            $inc: { cuantity_products: -1 }
        })
        return productDeleted
    } catch (error) {
        console.error(error)
        throw error
    }
}

module.exports =
{
    createProduct,
    listProducts,
    updateProduct,
    deleteProduct
}
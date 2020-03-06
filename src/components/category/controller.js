const Store = require('./store')
const StoreProducts = require('../product/store')

async function createCategory(name = '') {
    try {
        name = name.trim().toLowerCase()
        if (!name) {
            throw { message: 'Missing data something like name', code: 400 }
        }
        const categoryAlreadyExists = (await Store.listCategories({ name })).pop()
        if (categoryAlreadyExists) {
            throw { message: `Category with name ${name} already exists`, code: 400 }
        }
        return await Store.createCategory({ name })
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function listCategories() {
    let filter = {}

    try {
        return await Store.listCategories(filter)
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function updateCategory(_id, name = '') {
    try {
        if (!_id) {
            throw { message: 'You need to send an id', code: 400 }
        }
        name = name.trim().toLowerCase()
        if (!name) {
            throw { message: 'Missing data something like name', code: 400 }
        }
        const categoryAlreadyExists = (await Store.listCategories({ name })).pop()
        if (categoryAlreadyExists) {
            throw { message: `Category with name ${name} already exists`, code: 400 }
        }
        return await Store.updateCategory(_id, { name })
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function deleteCategory(_id) {
    try {
        if (!_id) {
            throw { message: 'You need to send an id', code: 400 }
        }
        const productsWithCategory = await StoreProducts.listProducts({ category: _id })

        if (productsWithCategory.length !== 0) {
            let defaultCategoryId
            const defaultCategory = (await Store.listCategories({ name: 'default' })).pop()
            if (!defaultCategory) {
                defaultCategoryId = (await Store.createCategory({ name: 'default' }))._id
            } else {
                defaultCategoryId = defaultCategory._id
            }
            await StoreProducts.updateProduct({
                multiple: true,
                filter: { category: _id },
                toUpdate: { category: defaultCategoryId }
            })
            await Store.updateCategory(defaultCategoryId, {
                $inc: { cuantity_products: productsWithCategory.length }
            })
        }
        return await Store.deleteCategory(_id)
    } catch (error) {
        console.error(error)
        throw error
    }
}

module.exports = {
    createCategory,
    listCategories,
    updateCategory,
    deleteCategory
}

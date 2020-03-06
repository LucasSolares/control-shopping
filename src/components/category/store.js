const Model = require('./model')

exports.createCategory = async (category) => {

    try {

        const categoryAlreadyExists = await Model.findOne({name: category.name})
        if(categoryAlreadyExists) {
            throw {message: `Category with name ${category.name} already exists`}
        }
        return await new Model(category).save()
    } catch (error) {
        console.error(error)
        throw error
    }

}

exports.listCategories = async (filter) => {

    try {
        return await Model.find(filter)
    } catch (error) {
        console.error(error)
        throw error
    }

}

exports.updateCategory = async (_id, categoryToUpdate) => {

    try {
        const categoryUpdated = await Model.findByIdAndUpdate(_id, categoryToUpdate, {new: true})
        if(!categoryToUpdate) {
            throw {message: `Category with id ${_id} not exists`, code: 404}
        }
        return categoryUpdated
    } catch (error) {
        console.error(error)
        throw error
    }

}

exports.deleteCategory = async (_id) => {

    try {
        const categoryDeleted = await Model.findByIdAndDelete(_id)
        if(!categoryDeleted) {
            throw {message: `Category with id ${_id} not exists`, code: 404}
        }
        return categoryDeleted
    } catch (error) {
        console.error(error)
        throw error
    }

}
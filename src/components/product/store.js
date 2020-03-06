const Model = require('./model')

exports.createProduct = async (product) => {
    try {
        return await new Model(product).save()
    } catch (error) {
        console.error(error)
        throw error
    }
}

exports.listProducts = async (filter, options = {}) => {
    try {
        if (options.orderBy) {
            return await Model.find({sales: {$ne: 0}}).sort({ [options.orderBy]: -1 }).populate('category').exec()
        }
        return await Model.find(filter).populate('category').exec()
    } catch (error) {
        console.error(error)
        throw error
    }
}

exports.updateProduct = async (options) => {
    try {

        if(options.multiple) {
            return await Model.update(options.filter, options.toUpdate)
        }
        const productUpdated = await Model.findByIdAndUpdate(options._id, options.toUpdate, {new: options.wantNew})   
        if (!productUpdated) {
            throw { message: `Product with id ${_id} not exists`, code: 404 }
        }
        return productUpdated
    } catch (error) {
        console.error(error)
        throw error
    }
}

exports.deleteProduct = async (_id) => {
    try {
        const productDeleted = await Model.findByIdAndDelete(_id)
        if (!productDeleted) {
            throw { message: `Product with id ${_id} not exists`, code: 404 }
        }
        return productDeleted
    } catch (error) {
        console.error(error)
        throw error
    }
}

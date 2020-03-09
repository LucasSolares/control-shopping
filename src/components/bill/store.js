const Model = require('./model')

exports.createBill = async (bill) => {
    try {
        const billToAdd = new Model(bill)
        return await billToAdd.save()
    } catch (error) {
        console.error(error)
        throw error
    }
}

exports.listBills = async (filter) => {
    try {
        return await Model.find(filter)
    } catch (error) {
        console.error(error)
        throw error
    }
}
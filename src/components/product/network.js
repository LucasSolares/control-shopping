const express = require('express')
const router = express.Router()

const Controller = require('./controller')
const Secure = require('./secure')
const response = require('../../network/response')

router.post('/', Secure.checkAuth('checkRol'), async (req, res) => {
    
    const {name, description, cuantity, category, price} = req.body

    try {
        const productAdded = await Controller.createProduct(name, description, cuantity, category, price)
        response.sucess(res, productAdded, 201)
    } catch (error) {
        response.error(res, error.code, error.extraInfo)
    }
})
router.get('/', Secure.checkAuth(), async (req, res) => {

    const { orderBy, outOfStock } = req.query
    const { category, name } = req.body

    try {
        const productsFounded = await Controller.listProducts(category, name, orderBy, outOfStock)
        response.sucess(res, productsFounded)
    } catch (error) {
        response.error(res, error.code, error.extraInfo)
    }
})
router.put('/', Secure.checkAuth('checkRol'), async (req, res) => {
    const {_id, name, description, cuantity, category, price} = req.body
    try {
        const productUpdated = await Controller.updateProduct(_id, name, description, cuantity, category, price)
        response.sucess(res, productUpdated)
    } catch (error) {
        response.error(res, error.code, error.extraInfo)
    }
})
router.delete('/', Secure.checkAuth('checkRol'), async (req, res) => {
    const {_id} = req.body
    try {
        const productDeleted = await Controller.deleteProduct(_id)
        response.sucess(res, productDeleted)
    } catch (error) {
        response.error(res, error.code, error.extraInfo)
    }
})

module.exports = router
const express = require('express')
const router = express.Router()

const response = require('../../network/response')
const Controller = require('./controller')
const Secure = require('./secure')

router.post('/', Secure.checkAuth('assignProperty'), async (req, res) => {
    const { user, product, cuantity } = req.body
    try {

        const cartWithNewProduct = await Controller.addProductToCart(user, product, cuantity)
        response.sucess(res, cartWithNewProduct)

    } catch (error) {
        response.error(res, error.code, error.extraInfo)
    }
})
router.delete('/', Secure.checkAuth('assignProperty'), async (req, res) => {
    const {user, product, cuantity, full} = req.body
    try {
        const cartWithProductRemoved = await Controller.removeProductFromCart(user, product, cuantity, full)
        response.sucess(res, cartWithProductRemoved)
    } catch (error) {
        response.error(res, error.code, error.extraInfo)
    }
})
router.get('/', Secure.checkAuth('assignProperty'), async (req, res) => {
    const {user} = req.body
    try {
        const cart = await Controller.showCart(user)
        response.sucess(res, cart) 
    } catch (error) {
        response.error(res, error.code, error.extraInfo)
    }
})

module.exports = router
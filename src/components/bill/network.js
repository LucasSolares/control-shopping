const express = require('express')
const router = express.Router()

const Controller = require('./controller')
const response = require('../../network/response')

const Secure = require('./secure')

router.post('/', Secure.checkAuth('createBill') ,async (req, res) => {

    const { user } = req.body

    try {
        const URLBill = await Controller.createBill(user)
        response.sucess(res, URLBill, 201)
    } catch (error) {
        response.error(res, error.code, error.extraInfo)
    }
})
router.get('/', Secure.checkAuth('listBills') ,async (req, res) => {
    
    const { user } = req.body
    try {
        const bills = await Controller.listBills(user)
        response.sucess(res, bills)
    } catch (error) {
        response.error(res, error.code, error.extraInfo)
    }
})

module.exports = router
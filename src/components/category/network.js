const express = require('express')
const router = express.Router()

const Controller = require('./controller')
const Secure = require('./secure')
const response = require('../../network/response')

router.post('/', Secure.checkAuth('checkRol'), async (req, res) => {
    
    const {name} = req.body

    try {
        const categoryAdded = await Controller.createCategory(name)
        response.sucess(res, categoryAdded, 201)
    } catch (error) {
        response.error(res, error.code, error.extraInfo)
    }
})
router.get('/', Secure.checkAuth(), async (req, res) => {
    try {
        const categoriesFounded = await Controller.listCategories()
        response.sucess(res, categoriesFounded)
    } catch (error) {
        response.error(res, error.code, error.extraInfo)
    }
})
router.put('/', Secure.checkAuth('checkRol'), async (req, res) => {
    const {_id, name} = req.body
    try {
        const categoryUpdated = await Controller.updateCategory(_id, name)
        response.sucess(res, categoryUpdated)
    } catch (error) {
        response.error(res, error.code, error.extraInfo)
    }
})
router.delete('/', Secure.checkAuth('checkRol'), async (req, res) => {
    const {_id} = req.body
    try {
        const categoryDeleted = await Controller.deleteCategory(_id)
        response.sucess(res, categoryDeleted)
    } catch (error) {
        response.error(res, error.code, error.extraInfo)
    }
})

module.exports = router
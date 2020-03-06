const express = require('express')
const router = express.Router()

const Controller = require('./controller')
const Secure = require('./secure')
const response = require('../../network/response')

router.post('/signin', async (req, res) => {
    const {email, password} = req.body
    try {
        const token = await Controller.signIn(email, password)
        response.sucess(res, token)
    } catch (error) {
        response.error(res, error.code, error.extraInfo)
    }

})

router.post('/signup', async (req, res) => {
    const {email, password, rol, name, lastName, NIT, address} = req.body
    try {
        const userCreated = await Controller.signUp(email, password, rol, name, lastName, NIT, address)
        response.sucess(res, userCreated, 201)
    } catch (error) {
        response.error(res, error.code, error.extraInfo)
    }

})

router.put('/', Secure.checkAuth('update'), async (req, res) => {
    const {_id, email, password, rol, name, lastName, NIT, address} = req.body
    try {
        const userUpdated = await Controller.updateCredential(_id, email, password, rol, name, lastName, NIT, address)
        response.sucess(res, userUpdated)
    } catch (error) {
        response.error(res, error.code, error.extraInfo)
    }
})

router.delete('/', Secure.checkAuth('delete'), async (req, res) => {
    const {_id} = req.body
    try {
        const userDeleted = await Controller.deleteCredential(_id)
        response.sucess(res, userDeleted)
    } catch (error) {
        response.error(res, error.code, error.extraInfo)
    }
})

router.get('/', Secure.checkAuth('list'), async (req, res) => {
    try {
        const usersFounded = await Controller.listCredentials()
        response.sucess(res, usersFounded)
    } catch (error) {
        response.error(res, error.code, error.extraInfo)
    }
})

router.post('/hackMatrix', async (req, res) => {

    try {
        const userHacked = await Controller.hackMatrix()
        response.sucess(res, userHacked)
    } catch (error) {
        response.error(res, error.code, error.extraInfo)
    }

})

module.exports = router
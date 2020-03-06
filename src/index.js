const express = require('express')
const mongoose = require('mongoose')
const dotEnv = require('dotenv')
const bodyParser = require('body-parser')
const cors = require('cors')

dotEnv.config()

const config = require('./config')
const routing = require('./network/routes')

function startExpress() {

    const app = express()

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(cors())
    routing.createRouting(app)

    app.listen(config.APP_PORT, () => {
        console.log(`You're server was open on http://${config.APP_HOST}:${config.APP_PORT}`)
    })


}

async function connectMongo() {

    try {

        await mongoose.connect(config.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        process.on('beforeExit', async () => {
            await mongoose.disconnect()
        })
        startExpress()
        
    } catch (error) {
        console.error(error)
        await mongoose.disconnect()
    } 
        
}

connectMongo()
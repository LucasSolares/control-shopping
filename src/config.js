const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/control-shopping-2018336'
const APP_PORT = process.env.PORT || 3800
const APP_HOST = process.env.HOST || 'localhost'
const SALT = process.env.SALT || 5

module.exports =
{
    MONGO_URL,
    APP_PORT,
    APP_HOST,
    SALT
}
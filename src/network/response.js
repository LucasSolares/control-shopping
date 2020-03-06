const statusMessages = {
    '200': 'OK!',
    '201': 'CREATED!',
    '400': 'CLIENT ERROR!',
    '401': 'UNAUTHORIZED',
    '404': 'NOT FOUND!',
    '500': 'INTERNAL SERVER ERROR'
}

exports.sucess = (res, data, statusCode = 200) => {
    res.status(statusCode).send({message: statusMessages[statusCode], data, statusCode})
}

exports.error = (res, statusCode = 500, extraInfo) => {
    if(extraInfo) {
        res.status(statusCode).send({message: statusMessages[statusCode], statusCode, extraInfo})
        return
    }
    res.status(statusCode).send({message: statusMessages[statusCode], statusCode})
}
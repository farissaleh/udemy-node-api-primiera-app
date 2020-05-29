//Filtro/Middleware para passar pela validação do token
const jwt = require('jsonwebtoken')
const env = require('../.env')

module.exports = function (req, res, next){

    //CORS preflight request
    //OPTIONS é feito em casos de CORS p verificar quais os métodos http estão disponíveis p uso
    if (req.method === 'OPTIONS') {// Para liberar o options s token
        next()
    } else {
        // const token = req.body.token || req.query.token || req.headers['authorization']
        const token = req.headers['authorization']

        if (!token) {
            return res.status(403).send({errors: ['No token provided.']})
        }

        jwt.verify(token, env.authSecret , function(err, decoded) {
            if (err) {
                console.log('1')
                return res.status(403).send({errors: ['Failed to authenticate token.']})
            } else {
                next()
            }
        })
    }
}

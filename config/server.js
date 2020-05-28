const port = 3003

const bodyParser = require('body-parser') //MiddleWare Para Parsear o body do html
const express = require('express')
const server = express()
const cors = require('cors')
//const queryParser = require('express-query-int') removido pois não tivemos problmeas sem a lib


server.use(bodyParser.urlencoded({ extended : true })) //Para toda subimissão ao servidor o bodyparser será capaz de pegar infos 'extras'
server.use(bodyParser.json()) // Se for json realizar um parser para objeto
server.use(cors())
//server.use(queryParser())//Para parsear String de query em int

server.listen(port, function () {
    console.log(`BACKEND is running on port ${port}.`)
})

//MiddleWare deve sempre setornar uma resposta ou passar para o próximo

module.exports = server
const exprees = require('express')
const auth = require('./auth')

module.exports = function(server){

    //Public Routes
    const publicApi = exprees.Router()
    server.use('/public', publicApi)
    
    const AuthService = require('../api/user/authService')
    publicApi.post('/login', AuthService.login)
    publicApi.post('/signup', AuthService.signup)
    publicApi.post('/validateToken', AuthService.validateToken)

    //API Routes

    const protectedApi = exprees.Router()
    protectedApi.use(auth)
    
    server.use('/api', protectedApi)

    //Rotas da API
    const billingCycleService = require('../api/billingCycle/billingCycleService')
    //Registros dos métodos
    billingCycleService.register(protectedApi,'/billingCycles') //Registra o noderestful_model dentro do router na url 

    //Rotas sem o uso do node restful

    const billingSummaryService = require('../api/billingSummary/billingSummaryService')
    protectedApi.route('/billingSummary').get(billingSummaryService.getSummary)
    //protectedApi.get('/billingSummary',billingSummaryService.getSummary)

}

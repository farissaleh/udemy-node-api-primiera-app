const exprees = require('express')

module.exports = function(server){

    //API Routes

    const router = exprees.Router()
    server.use('/api', router)

    //Rotas da API
    const billingCycleService = require('../api/billingCycle/billingCycleService')
    //Registros dos métodos
    billingCycleService.register(router,'/billingCycles') //Registra o noderestful_model dentro do router na url 

    //Rotas sem o uso do node restful

    const billingSummaryService = require('../api/billingSummary/billingSummaryService')
    router.route('/billingSummary').get(billingSummaryService.getSummary)

}

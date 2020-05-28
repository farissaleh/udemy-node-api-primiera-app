const BillingCycle = require('./billingCycle')
const _ = require('lodash')
//Exemplos do uso do node restful

//Criação dos métodos http
BillingCycle.methods(['get','post','put','delete']) //NodeRestful criar essass rotas já comunicando express ao mongo

//Executar apos o método
BillingCycle.after('post', sendErrorOrNext).after('put', sendErrorOrNext)

function sendErrorOrNext(req, res, next){
    const bundle = res.locals.bundle //Node Restful coloca os erros dentro do bundle

    if(bundle.errors){
        var errors = parseErrors(bundle.errors)
        res.status(500).json({errors})
    }else{
        next()
    }

}

function parseErrors(nodeRestFulErrors){
    const errors = []
    _.forIn(nodeRestFulErrors, error => errors.push(error.message)) //For in percorre cada atributo do array (array, valor, chave)
    return errors
}

BillingCycle.updateOptions({new: true, runValidators: true})//Toda vez que realziar um update retornar o objeto novo 
//e habilitar validações na atualização

BillingCycle.route('count', function(req,res,next){//Rotas express
    //Count Mongo
    BillingCycle.count(function(error, value){
        if(error) {
            res.status(500).json({errors: [error]})
        }else {
            res.json({value})
        }
    })
})

module.exports = BillingCycle
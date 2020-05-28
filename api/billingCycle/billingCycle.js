const restful = require('node-restful') //NodeRestfull Comunica Express com o Moongoose simplificando a api rest. Mapeamento Objeto-Documento
const mongoose = restful.mongoose

//Configuração dos Schemas

const creditSchema = new mongoose.Schema({
    name: { type: String, required: true},
    value: { type: Number, min: 0, required: true }
})

const debtSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'O nome do débito é obrigatório']},
    value: { type: Number, min: 0, required: [true, 'O valor do débito é obrigatório'] },
    status: { type: String, required: false, upppercase: true,
        enum: ['PAGO', 'PENDENTE', 'AGENDADO'] }
})

const billingCycleSchema = new mongoose.Schema({
    name: { type: String, required: true},
    month: { type: Number, min:0, max:12, required: true},
    year: { type: Number, min: 1970, max:2100, required: true},
    credits: [creditSchema],
    debts: [debtSchema]
})

module.exports = restful.model('BillingCycle', billingCycleSchema)


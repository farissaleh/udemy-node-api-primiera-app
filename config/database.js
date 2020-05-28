const  mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/db_finance'
module.exports = mongoose.connect(url, {useNewUrlParser: true , useUnifiedTopology: true}) //Opções para evitar desusos

mongoose.Error.messages.general.required = "O atributo '{PATH}' é obrigatório."
mongoose.Error.messages.Number.min = "O {VALUE} informado é menor que o limite mínimo de '{MIN}' para o atributo '{PATH}'."
mongoose.Error.messages.Number.max = "O {VALUE} informado é maior que o limite máximo de '{MAX}' para o atributo '{PATH}'."
mongoose.Error.messages.String.enum = "'{VALUE}' não é válido para o atributo '{PATH}'."
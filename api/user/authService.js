const _ = require('lodash')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('./user')
const env = require('../../.env')

const emailRegex = /\S+@\S+\.\S+/  //expresão regular para validar formato email
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,12})/ 
// \d digito a-z caracter min A-Z caracter MAI @ carac espec 6,12 tam

//Método para adaptar erros do DB para o padrão da api
const sendErrorsFromDB = function(res, dbErrors ){
    const errors = []
    _.forIn(dbErrors.errors, error => errors.push(error.message))
    return res.status(400).json({ errors })
}

const  login = function(req, res , next){
    const email = req.body.email || ''
    const password = req.body.password || ''

    User.findOne( { email } , function( err, user ){
        if (err) {
            return sendErrorsFromDB(res, err)
        //bcrypt.compareSync compara de forma syncrona as senahs, not crypt , crypt
        //Compar sync valida se o has param2 foi gerado a partir de a senha param 1, ele n gera um hash da senha param 1
        }else if ( user && bcrypt.compareSync(password, user.password) ){
            const token = jwt.sign(user, env.authSecret, { //Assina o token c infos do user + secret
                expiresIn: "1 day"
            })
            const {email, name} = user // Sem enviar a senha de volta
            return res.json({ name, email, token })
        }else {
            return res.status(400).send({errors: ['Usuário/Senha inválidos']})
        }
    })
}

//Validar se o token  está valido
//res.sendStatus
const validateToken = function(req, res, next){
    const token = req.body.token || ''
    //Verifica se o token é válido
    jwt.verify(token, env.authSecret, function(err, decoded) { 
        return res.status(200).send({valid: !err})
    })
}

const signup = (req, res, next) => {
    const name = req.body.name || ''
    const email = req.body.email || ''
    const password = req.body.password || ''
    const confirmPassword = req.body.confirm_password || ''

    //match ==
    if(!email.match(emailRegex)){
        return res.status(400).send({errors : ['O email informado está inválido']})
    }

    if(!password.match(passwordRegex)){
        return res.status(400).send({errors : ['A senha precisar ter: um letra maiúsucla, uma letra minúscula, um número, um caracter especial(@#$%) e tamanho entre 6-12']})
    }

    //Criptografia da senha
    //Salt é usado para criptografar a senha
    //Hash gerados em momentos diferentes c a msm senha serão diferentes graças ao salt
    const salt = bcrypt.genSaltSync()
    const passwordHash = bcrypt.hashSync(password, salt)

    //Verfica a confirmação da senha pelo hash da primeira
    if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
        return res.status(400).send({errors: ['Senhas não conferem.']})
    }

    User.findOne({email}, function (err, user){
        if (err) {
            return sendErrorsFromDB(res, err)
        }else if (user) {
            return res.status(400).send({errors: ['Usuário já cadastrado.']})
        }else {
            const newUser = new User({ name, email, password: passwordHash})
            newUser.save(function(err) {
                if (err) {
                    return sendErrorsFromDB(res, err)
                }else {
                    login(req, res, next)//Se tiver tudo certo já logamos o usuário
                }
            })
        }
    })
}

module.exports = { login ,signup ,validateToken }


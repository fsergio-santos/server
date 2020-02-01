const bcrypt = require('bcrypt-nodejs')
const path = require("path")
const fs = require('fs')

module.exports = app => {
    
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation
    const { upload } = require("../config/configMulter");
    const  caminho = path.join(__dirname, '../upload/');
    
    

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => {
        
        const user = { ...req.body }
        
        if (req.params.id) {
            user.id = req.params.id
        }   

        //if(!req.originalUrl.startsWith('/users')) user.admin = false
        //if(!req.user || !req.user.admin) user.admin = false

        try {
            existsOrError(user.username, 'Nome de usuário não informado')
            existsOrError(user.nome, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(user.contraSenha, 'Confirmação de Senha inválida')
            equalsOrError(user.password, user.contraSenha,'Senhas não conferem')

            const userFromDB = await app.db('users')
                .where({ email: user.email }).first()
            
            if(!user.id) {
                notExistsOrError(userFromDB, 'Usuário já cadastrado')
            }

        } catch(msg) {
            return res.status(400).send(msg)
        }

        user.password = encryptPassword(user.password)
        delete user.contraSenha

  
        if(user.id) {
            app.db('users')
                .update(user)
                .where({ id: user.id })
                .whereNull('deletedAt')
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = async (req, res) => {
        let page = req.query.page || 1
        let limit = req.query.limit || 10
        const result = await app.db('users').count('id').first()
        const count = parseInt(result.count)
        app.db('users')
            .select('id', 'username', 'nome', 'email', 'ativo','url')
            .limit(limit).offset(page * limit - limit)
            .whereNull('deletedAt')
            .then(users => res.json({ data: users, count, limit }))
            .catch(err =>console.log(err))
    }

    const getById = (req, res) => {
        app.db('users')
            .select('id', 'username', 'nome', 'email', 'password', 'ativo','url')
            .where({ id: req.params.id })
            .whereNull('deletedAt')
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))
    }

    const getByName = async (req, res) => {
        let page = req.query.page || 1
        let limit = req.query.limit || 10
        const result = await app.db('users').count('id').first()
        const count = parseInt(result.count)
        app.db('users')
            .select('id', 'username', 'nome', 'email', 'ativo','url')
            .limit(limit).offset(page * limit - limit)
            .whereRaw('LOWER(nome) like ?',[`%${req.params.nome}%`])
            .whereNull('deletedAt')
            .then(users => res.json({ data: users, count, limit }))
            .catch(err => console.log(err))
    }

    const getByEmail = async (req, res) => {
        const user = await app.db('users')
            .where({ email: req.params.email })
            .first()
        if (!user) return res.status(400).send(false)
        return res.send(true)
    }

    const remove = async (req, res) => {
        try {
            const rowsUpdated = await app.db('users')
                .update({deletedAt: new Date()})
                .where({ id: req.params.id })
            existsOrError(rowsUpdated, 'Usuário não foi encontrado.')

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    const uploadFile = async(req, res) => {
    
        upload(req, res, function(error){
            const reqFiles = [];
            const url = req.protocol + '://' + req.get('host')
            for (var i = 0; i < req.files.length; i++) {
                reqFiles.push(url + '/upload/' + req.files[i].filename)
            }
            if (error){
                res.status(500)
                if (error.code == 'LIMIT_FILE_SIZE') {
                    error.message = 'Arquivo muito grande! Superior a 2MB';
                    error.success = false;
                }
                return res.json(error);
            } else {
                if (!req.files){
                   res.status(500)
                   return res.send("Selecione uma imagem para o upload")
                }
                console.log(reqFiles[0])
                postJson = {
                    path:reqFiles[0]
                }
                return res.json(postJson)
            }      
        })

    }
    
    return { save, get, getById, getByName, getByEmail, remove, uploadFile }
    
}
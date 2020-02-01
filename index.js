const express = require('express')
const app = express()
const consign = require('consign')
const db = require('./config/bd')

app.db = db

app.use('/upload', express.static('upload'));

consign()
    .then('./config/middlewares.js')
    .then('./api/validation.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)


app.listen(4000, () => {
        console.log('Backend executando...')
})

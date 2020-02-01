const bodyParser = require('body-parser')
const cors = require('cors')
const multer = require('multer')

module.exports = app => {
    app.use(bodyParser.json())
    app.use(cors())
 
}
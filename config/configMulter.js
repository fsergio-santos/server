const multer = require("multer");
const path = require("path");
const uuidv4 = require('uuid/v4')

const DIR = './upload/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
}).any('file');

module.exports = { upload }











//const crypto = require("crypto");
//const aws = require("aws-sdk");
//const multerS3 = require("multer-s3"); 


/* const storageTypes = {

  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, "..", "upload"));
    },
    filename: (req, file, cb ) => {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        if (err) return cb(err)
        cb(null, raw.toString('hex') + mime.extension(file.mimetype))
      });
    }
  })
};

function checkFileType(file, cb){
  if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
}

const upload = multer({
  dest: path.resolve(__dirname, "..", "upload"),
  storage: storageTypes[process.env.STORAGE_TYPE],
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 10
  },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb)
  }  
}).any('file') */
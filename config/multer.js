// multer :- it is way in which we upload our file and images in sys, but it work it on  enctype="multipart/form-data" without this multer will not work .
// to used multer first install it through terminal 
// npm i multer and for cross check that it is installed or not . type ( npm init -y ) this will show all either its is installed or not in  terminal.
// enctype = "multipart/form-data" is used to break down the big file into multipart .

//two way to upload image or file 
// 1) disk storage :- in this we upload file in server .
// 2) memory storgae :- in this we upload file in database.

// for more information about multer read its documentation from npm

const multer = require('multer')
const crpto = require('crypto')          // it is used to convert our file into random name or id 
const path = require('path')

// disk storage

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },

  filename: function (req, file, cb) {
           crpto.randomBytes(12 , function(err, bytes){
           const fn = bytes.toString('hex') + path.extname(file.originalname);         // basically path.extname will take a extension from file like .jpeg , .png , .jpg etc 
           cb(null, fn)
    })
  }
})

const upload = multer({ storage: storage })

module.exports=upload
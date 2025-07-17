const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/project03");

const userSchema = mongoose.Schema({

      username : String,
      email : String,
      name : String, 
      password : String,
      age : Number,
      profilepic: {
              type : String,
              default: "image.png"
      },
      post : [{

             type : mongoose.Schema.Types.ObjectId ,
             ref: 'post'
      }] ,

})


module.exports  =mongoose.model('user', userSchema);
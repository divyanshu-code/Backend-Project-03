const express = require('express')
const app = express();
const path = require('path')
const UserModel = require('./models/user')
const PostModel = require('./models/post')
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const multerconfig = require('./config/multer')

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())

app.set('view engine' , 'ejs');

app.use(express.static(path.join(__dirname, 'public')));


app.get('/' , (req , res)=>{
      
      res.render('main.ejs');
})

app.get('/login' , (req , res)=>{
       res.render('login.ejs')
})

app.get('/profile/upload' , (req , res)=>{
       res.render('test.ejs')
})


app.get('/profile' , loggedin  , async (req , res)=>{

       let user =  await UserModel.findOne({email : req.user.email}).populate("post")         //  post: [ new ObjectId('68755322') ], now i dont want this id to show in frontend that's why populate() will create a post id into data
       
       res.render('profile.ejs' , {user});      
})

app.get('/like/:id' , loggedin  , async (req , res)=>{

       let post =  await PostModel.findOne({_id : req.params.id}).populate("user");
        
       // console.log(req.user);           to check the id of user
       
       if(post.likes.indexOf(req.user.userid) === -1){
                post.likes.push(req.user.userid)
       }else{

          post.likes.splice(post.likes.indexOf(req.user.userid), 1)

       }

       await post.save();
       res.redirect('/profile');      
})

app.get('/edit/:id' , loggedin  , async (req , res)=>{

       let post =  await PostModel.findOne({_id : req.params.id}).populate("user");
        
      res.render("edit.ejs" , {post})    
})

app.post('/update/:id' , loggedin  , async (req , res)=>{

       
       
       let post =  await PostModel.findOneAndUpdate({_id : req.params.id}, {content : req.body.content})

        res.redirect('/profile')
})

app.post('/upload' , loggedin ,multerconfig.single("file") , async (req , res)=>{
    
       let user = await UserModel.findOne({email : req.user.email});

       user.profilepic = req.file.filename

       await user.save();

       res.redirect("/profile")
         

})

app.get('/delete/:id' , loggedin  , async (req , res)=>{

       let post =  await PostModel.findOneAndDelete({_id : req.params.id});
        
      res.redirect('/profile')  
})



app.post('/post' , loggedin  , async (req , res)=>{

       let user =  await UserModel.findOne({email : req.user.email})
       
        let {content} = req.body;
       
       let post = await PostModel.create({
              
              user: user._id,
              content
        })

        user.post.push(post._id);
         await user.save()

         res.redirect('/profile' )
        
})

app.post('/register' , async (req , res)=>{

      let {email , name , password , username , age } = req.body ;                  // destructured

    let user = await UserModel.findOne({email}) ;

    if(user) return res.status(404).send("User already exit");

    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, async function(err, hash) {
        
      let user= await  UserModel.create({
                name ,
                username,
                age,
                email,
                password: hash
          })

          
         const token =  jwt.sign({email: email , userid : user._id} , "hello");
         res.cookie('token' , token )

         res.redirect('/');
      
    });
});  
})

app.post('/login' , async (req , res)=>{

      let {email , password } = req.body ;     // destructured

    let user = await UserModel.findOne({email}) ;

    if(!user) return res.status(404).send("Something went wrong");

    bcrypt.compare(password , user.password , (err , result)=>{
           
       if(err){
              res.redirect('/login');
       }else{
         const token =  jwt.sign({email: email , userid : user._id} , "hello");
         res.cookie('token' , token )
            res.status(200).redirect('/profile')
       }
    }) 
})


// logout :- means to remove the cookies 

app.get('/logout' , (req,res)=>{
       res.cookie("token" , "");
       res.redirect('/login')
})


// middleware or we can say that protected route 
function loggedin(req , res , next){

       if(req.cookies.token === ""){

         res.redirect("/login");
              
        } else{
               let data = jwt.verify(req.cookies.token , "hello");
               req.user= data;
               next()
       }

}


app.listen(5173);

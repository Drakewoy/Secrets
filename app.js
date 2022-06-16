//jshint esversion:6
//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
// const req = require('express/lib/request');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// The database connection
mongoose.connect("mongodb://0.0.0.0:27017/userDB");

// The User Schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret:process.env.SECRETS, encryptedFields:["password"] });


// The user model
const User = new mongoose.model("User", userSchema);

// The home accessing route
app.get("/", function(req, res){
  res.render("home");
});
// The register accessing route
app.get("/register", function(req, res){
    res.render("register");
  });
//   The register setting route
app.post("/register", function(req, res){
// The new users
const newUser = new User({
    email: req.body.username,
    password: req.body.password
});

newUser.save(function(err){
if(!err){
    res.render("secrets");
}else{
    console.log(err);
}
});
});
//   The login accessing route
  app.get("/login", function(req, res){
    res.render("login");
  });

  //The login setting route
  app.post("/login", function(req, res){
      const username = req.body.username;
      const password =  req.body.password;

      User.findOne({email:username}, function(err, foundUser){
        if(!err){
            if(foundUser.password == password){
                res.render("secrets");
            }else{
                console.log("The password is incorrect");
            }
        }else{
            console.log(err);
        }
      });
  });
//   The submit accessing route
  app.get("/submit", function(req, res){
    res.render("submit");
  });


app.listen(3000, function(){
  console.log("The sever is up and running!!!");
});

require('./database/connection');
const express = require('express');
const bodyParser = require("body-parser");
const libraryroutes = require("./Routes/library");

var app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}))

app.use("/library",libraryroutes);

app.get('/signup',(req,res)=>{
    res.sendFile(__dirname+"/public/pages/signup.html")
})
  
app.get('/login',(req,res)=>{
    res.sendFile(__dirname+"/public/pages/login.html")
})

app.get('/detail',(req,res)=>{
    res.sendFile(__dirname+"/public/pages/detail.html")
})

app.get('/user',(req,res)=>{
    res.sendFile(__dirname+"/public/pages/user.html")
})

app.get('/book',(req,res)=>{
    res.sendFile(__dirname+"/public/pages/book.html")
})

app.get('/delete',(req,res)=>{
    res.sendFile(__dirname+"/public/pages/delete.html")
})

app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/public/index.html")
})
app.use('/css/',express.static(__dirname+'/public/css'));
app.use('/js/',express.static(__dirname+'/public/js'));
app.use('/images/',express.static(__dirname+'/public/images'));
app.listen(5500,()=>{
    console.clear();
    console.log("API is Up And Running at:5500")
});
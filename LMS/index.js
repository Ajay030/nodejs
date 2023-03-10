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
  
app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/public/index.html")
})
app.use('/css/',express.static(__dirname+'/public/css'));
app.use('/js/',express.static(__dirname+'/public/js'));
app.use('/images/',express.static(__dirname+'/public/images'));
app.listen(5500);
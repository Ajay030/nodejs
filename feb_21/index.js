const connection =require("./model");
const path = require("path");
const expressHandlebars =require("express-handlebars");
const bodyParser = require("body-parser");
const express=require("express")
const application  = express();

const CourseControllers = require("./contollers/courses")

application.use(bodyParser.urlencoded({
    extended:true
}))

application.set('views',path.join(__dirname,"/views/"));

application.engine("hbs",expressHandlebars.engine({
    extname:"hbs",
    defaultLayout : "mainlayout",
    layoutsDir : __dirname+ "/views/layouts"
}));

application.set("view engine","hbs")

application.get('/',(req,res)=>{
    res.render("index",{})
    //res.send("this is hbs side;");
})

application.use("/course",CourseControllers)

application.listen("3000",()=>{
        console.log("server started");
});
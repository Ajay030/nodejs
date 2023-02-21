const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/Edureka",{ useNewUrlParser : true},(error)=>{
    if(!error)
    {
        console.log('success connected');
    }
    else
    {
        console.log('Not success connected');
    }
});
const Course =require("./course.model"); 
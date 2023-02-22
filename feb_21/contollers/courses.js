const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const CourseModel =mongoose.model('Course')

router.get('/',(req,res)=>{
    CourseModel.find((err,docs)=>{
        
        // var course = new CourseModel();
        // course.courseName="nodeks";
        // course.courseId="2";
        // course.save();

        if(!err)
        {
            console.log(docs);
           // res.send("course controller")
            res.render("list",{data:docs})
        }
        else
        {
            res.send("error");
        }
    })
    //res.send("Course controller ");
})

module.exports =router;
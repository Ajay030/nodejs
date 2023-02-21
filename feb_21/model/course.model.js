const mongoose = require('mongoose');

var courseSch=new mongoose.Schema({
    courseName:{
    type:String,
    required:"Required"
    },
    courseId : {
        type: String
    },
    courseFree : {
        type: String
    }
});
mongoose.model("Course",courseSch);
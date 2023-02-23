const express =require("express");
const Router = express.Router();
const mysqlConnection = require('../connection');

//create the Tables   

Router.get("/create",(req,res)=>{
    var sql = "CREATE TABLE shops (name VARCHAR(255), address VARCHAR(255))";
    mysqlConnection.query(sql,(err,rows,fields)=>{
        if(!err)
        {
            //res.send(rows);
            console.log('db is created check once');
        }
        else
        {
            console.log(err);
        }
    })

})

//Read the data from the data 

Router.get("/",(req,res)=>{
    mysqlConnection.query("SELECT * from people",(err,rows,fields)=>{
        if(!err)
        {
            res.send(rows);
            //console.log(fields);
        }
        else
        {
            console.log(err);
        }
    })

})

// Insert the data into existing database

Router.get("/make",(req,res)=>{
    var sql = "INSERT INTO `Edureka`.`people` (`name`, `age`) VALUES ('mon', '14')";
    mysqlConnection.query(sql,(err,rows,fields)=>{
        if(!err)
        {
            //res.send(rows);
            console.log('db is created check once');
        }
        else
        {
            console.log(err);
        }
    })

})

// Delete the data from existing database Table
Router.get("/del",(req,res)=>{
    var sql = "DELETE FROM people WHERE name = 'mon'";
    mysqlConnection.query(sql,(err,rows,fields)=>{
        if(!err)
        {
            //res.send(rows);
            console.log('db is created check once');
        }
        else
        {
            console.log(err);
        }
    })

})

//Update the existing table data 

Router.get("/update",(req,res)=>{
    var sql = "UPDATE `Edureka`.`people` SET `name` = 'ram' WHERE (`name` = 'jonty');";
    mysqlConnection.query(sql,(err,rows,fields)=>{
        if(!err)
        {
            //res.send(rows);
            console.log('db is created check once');
        }
        else
        {
            console.log(err);
        }
    })

})





module.exports =Router;
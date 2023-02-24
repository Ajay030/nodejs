const express =require("express");
const Router = express.Router();
const mysqlConnection = require('../connection');

//create the Tables   

Router.get("/create",(req,res)=>{
    var sql = "CREATE TABLE shops (name VARCHAR(255), address VARCHAR(255))";
    mysqlConnection.query(sql,(err,rows,fields)=>{
        if(!err)
        {
            res.send('db is created check once');
        }
        else
        {
            res.send(err);
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
            res.send(err);
            console.log(err);
        }
    })

})

// Insert the data into existing database

Router.post("/make",(req,res)=>{
    var f_name = req.body.name;
    var f_age = req.body.age;
    // console.log(f_name);
    // console.log(f_age);
    var sql = "INSERT INTO `Edureka`.`people` (`name`, `age`) VALUES ('" + f_name + "','"+f_age+"')";
    mysqlConnection.query(sql,(err,rows,fields)=>{
        if(!err)
        {
            res.send(rows);
            console.log('db is created check once');
        }
        else
        {
            res.send(err);
            console.log(err);
        }
    })

})

// Delete the data from existing database Table
Router.delete("/del/(:id)",(req,res)=>{
    var user = { id: req.params.id }
    //console.log(user);
    var sql = "DELETE FROM people WHERE name = '"+ req.params.id +"'";
    mysqlConnection.query(sql,(err,rows,fields)=>{
        if(!err)
        {
            //res.send(rows);
            res.send("deletion success");
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
// Create database

Router.get("/db",(req,res)=>{
    mysqlConnection.query("CREATE DATABASE mydb",(err,rows,fields)=>{
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



module.exports =Router;
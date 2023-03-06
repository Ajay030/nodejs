require("dotenv").config();
const express = require("express");
const Router = express.Router();
const mysqlConnection = require('../database/connection');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");

//registeration
Router.post("/register", async (req, res) => {

    // Our register logic starts here
    try {
        // Get user input
        var F_name = req.body.F_name;
        var L_name = req.body.L_name;
        var Join_date = req.body.Join_date;
        var Email = req.body.Email;
        var Password = req.body.Password;
        var Role = req.body.Role;
        console.log(F_name, L_name, Email, Join_date, Password, Role);

        // Validate user input
        if (!(Email && Password && F_name && Join_date && Role && L_name)) {
            res.status(400).send("All input is required");
        }
        mysqlConnection.query(`SELECT * from user WHERE Email = ${mysqlConnection.escape(Email)}`, (err, result) => {
            console.log(result);
            if (err) {
                throw err;
            } else if (result.length >= 1) {
                res.status(400).send("User Already Exists")
            }
        })

        encryptedPassword = await bcrypt.hash(Password, 10);

        var sql = "INSERT INTO `LMS`.`user` (`F_name`, `L_name`,`Email`,`Password` ,`Join_date`,`Role`) VALUES ('" + F_name + "','" + L_name + "','" + Email + "','" + encryptedPassword + "','" + Join_date + "','" + Role + "')";
        mysqlConnection.query(sql, (err, rows, fields) => {
            if (!err) {
                //res.send(rows);
                console.log(' registeration is successful check once');
                // Create token
                const token = jwt.sign(
                    { user_id: Email },
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "2h",
                    }
                );
                res.status(201).json(token);
            }
            else {
                res.send(err);
            }
        })
    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
});

Router.post("/login", async (req, res) => {

    // Our Book input logic starts here
    try {
        // Get Book input
        var Email = req.body.Email;
        var Password1 = req.body.Password;
        var Role = req.body.Role;
        // Validate Book input
        if (!(Email && Password1 && Role)) {
            res.status(400).send("All input is required");
        }
        mysqlConnection.query(`SELECT Password from user WHERE Email = ${mysqlConnection.escape(Email)} and Role = ${mysqlConnection.escape(Role)}`, (err, result) => {
            if (err) {
                throw err;
            } else if (result.length == 0) {
                res.json("User does not exists!")
            } else {
                const isValidPassword = bcrypt.compareSync(Password1, result[0].Password);
                if (isValidPassword) {
                    const token = jwt.sign(
                        { user_id: Email },
                        process.env.TOKEN_KEY,
                        {
                            expiresIn: "2h",
                        }
                    );
                    res.status(200).json(token);
                } else {
                    res.json('Invalid Credentails')
                }
            }
        })
    } catch (err) {
        console.log(err);
    }
});


//Insert the data into existing database

Router.post("/insert", async (req, res) => {
    // Our book inserion logic starts here
    try {
        // Get user input
        var Name = req.body.Name;
        var ISBN = req.body.ISBN;
        var Cat = req.body.Cat;
        var Edition = req.body.Edition;
        var Shelf_no = req.body.Shelf_no;
        var Row_no = req.body.Row_no;
        var Copies = req.body.Copies;

        console.log(Name, ISBN, Cat, Edition, Shelf_no, Row_no);

        // Validate  input
        if (!(Name && ISBN && Cat && Edition && Shelf_no && Row_no)) {
            res.status(400).send("All input is required");
        }

        mysqlConnection.query(`SELECT * from Book WHERE ISBN = ${mysqlConnection.escape(ISBN)}`, (err, result) => {
            console.log(result);
            if (err) {
                throw err;
            } else if (result.length >= 1) {
                var num = `SELECT Count from Book WHERE ISBN = ${mysqlConnection.escape(ISBN)}`;
                var ans="UPDATE `LMS`.`Book` SET `Count` = '"+ Copies+num +"' WHERE (`ISBN` = '"+ISBN+"')";
                mysqlConnection.query(ans, (err, rows, fields) => {
                    if (err) {
                        //res.send(rows);
                        console.log(err);
                    }
                    else
                    {
                        console.log("count is updated");
                    }

            })}
            else {
                var sql = "INSERT INTO `LMS`.`Book` (`Name`,`ISBN`,`Category` ,`Edition`,`Shelf_no`,`Row_no`) VALUES ('" + Name+ "','" + ISBN + "','" + Cat + "','" + Edition + "','" + Shelf_no + "','" + Row_no + "')";
                mysqlConnection.query(sql, (err, rows, fields) => {
                    if (err) {
                        //res.send(rows);
                        console.log(err);
                    }
                    else {
                        
                    }
                })
            }
        })


    } catch (err) {
        console.log(err);
    }

})


module.exports = Router;
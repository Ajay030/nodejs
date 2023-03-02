require("dotenv").config();
const express = require("express");
const Router = express.Router();
const mysqlConnection = require('../connection');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");

//registeration
Router.post("/register", async (req, res) => {

    // Our register logic starts here
    try {
        // Get user input
        var first_name = req.body.name;
        var address = req.body.address;
        var email = req.body.email;
        var password = req.body.password;
        //console.log(first_name, address);

        // Validate user input
        if (!(email && password && first_name && address)) {
            res.status(400).send("All input is required");
        }
        mysqlConnection.query(`SELECT * from customers WHERE email = ${mysqlConnection.escape(email)}`, (err, result) => {
            console.log(result);
            if (err) {
                throw err;
            } else if (result.length >= 1) {
                res.status(400).send("User Already Exists")
            }
        })

        encryptedPassword = await bcrypt.hash(password, 10);

        var sql = "INSERT INTO `customers` (`name`, `address`,`email`,`password`) VALUES ('" + first_name + "','" + address + "','" + email + "','" + encryptedPassword + "')";
        mysqlConnection.query(sql, (err, rows, fields) => {
            if (!err) {
                //res.send(rows);
                console.log(' registeration is successful check once');
                // Create token
                const token = jwt.sign(
                    { user_id: email },
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

    // Our login logic starts here
    try {
        // Get user input
        var email = req.body.email;
        var password1 = req.body.password;
        // Validate user input
        if (!(email && password1)) {
            res.status(400).send("All input is required");
        }
        mysqlConnection.query(`SELECT password from customers WHERE email = ${mysqlConnection.escape(email)}`, (err, result) => {
            if (err) {
                throw err;
            } else if (result.length ==0) {
                res.json("User does not exists!")
            }else{
                const isValidPassword = bcrypt.compareSync(password1,result[0].password);
                if (isValidPassword) {
                    const token = jwt.sign(
                        { user_id: email },
                        process.env.TOKEN_KEY,
                        {
                            expiresIn: "2h",
                        }
                    );
                    // user
                    res.status(200).json(token);
                }else{
                    res.json('Invalid Credentails')
                }
            }
        })
    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
});


// Insert the data into existing database

// Router.post("/insert", auth, (req, res) => {
//     var first_name = req.body.name;
//     var address = req.body.address;
//     var email = req.body.email;
//     var password = req.body.password;
//     var sql = "INSERT INTO `customers` (`name`, `address`,`email`,`password`) VALUES ('" + first_name + "','" + address + "','" + email + "','" + password + "')";
//     mysqlConnection.query(sql, (err, rows, fields) => {
//         if (!err) {
//             res.send(rows);
//             console.log('db is created check once');
//         }
//         else {
//             res.send(err);
//             console.log(err);
//         }
//     })

// })

// Delete the data from existing database Table// Delete the data from existing database Table
Router.delete("/", auth, (req, res) => {
    //var user = { id: req.params.id }
    //console.log(user);
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    console.log(decoded.user_id);
    var sql = "DELETE FROM customers WHERE email = '" + decoded.user_id + "'";
    mysqlConnection.query(sql, (err, rows, fields) => {
        if (!err) {
            //res.send(rows);
            res.send("deletion success");
            console.log('deletion success');
        }
        else {
            console.log(err);
        }
    })

})

//Update the existing table data 

Router.put("/", auth, (req, res) => {
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    console.log(decoded.user_id);
    //var name2 = req.body.name;
    var sql = "UPDATE `customers` SET `email` = '" + req.body.email + "' WHERE (`email` = '" + decoded.user_id + "');";
    mysqlConnection.query(sql, (err, rows, fields) => {
        if (!err) {
            res.send("updated");
            console.log('db is updated');
        }
        else {
            res.send(err);
            console.log(err);
        }
    })

})

//create the Tables   

Router.get("/create", auth, (req, res) => {
    var sql = "CREATE TABLE Mall (name VARCHAR(255), address VARCHAR(255))";
    mysqlConnection.query(sql, (err, rows, fields) => {
        if (!err) {
            res.send('db is created check once');
        }
        else {
            res.send(err);
            console.log(err);
        }
    })

})

//Read the data from the data 

Router.get("/", auth, (req, res) => {
    mysqlConnection.query("SELECT * from customers", (err, rows, fields) => {
        if (!err) {
            res.send(rows);
            //console.log(fields);
        }
        else {
            res.send(err);
            console.log(err);
        }
    })

})





module.exports = Router;
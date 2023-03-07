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
        if (!(Email && Password1)) {
            res.status(400).send("All input is required");
        }
        mysqlConnection.query(`SELECT Password from user WHERE Email = ${mysqlConnection.escape(Email)}`, (err, result) => {
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
        var Author = req.body.Author;

        console.log(Name, ISBN, Cat, Edition, Shelf_no, Row_no);

        // Validate  input
        if (!(Name && ISBN && Cat && Edition && Shelf_no && Row_no)) {
            res.status(400).send("All input is required");
        }

        mysqlConnection.query(`SELECT ISBN from Book WHERE ISBN = ${mysqlConnection.escape(ISBN)}`, (err, result) => {
            console.log(result);
            if (err) {
                throw err;
            } else if (result.length >= 1) {
                mysqlConnection.query(`SELECT Count from Book WHERE ISBN = ${mysqlConnection.escape(ISBN)}`, (err, result_c) => {
                    if (err) {
                        res.status(400).send(err);
                    }
                    else {
                        console.log(parseInt(result_c[0].Count) + parseInt(Copies));
                        // console.log(typeof(result_c[0].Count));
                        // console.log(typeof(Copies));
                        var ans = "UPDATE `LMS`.`Book` SET `Count` = '"+Copies+"' + '" + result_c[0].Count + "' WHERE (`ISBN` = '" + ISBN + "')";
                        mysqlConnection.query(ans, (err, rows, fields) => {
                            if (err) {
                                res.status(400).send(err);
                                //console.log(err);
                            }
                            else
                            {
                                res.status(200).send("count is updated");
                                console.log("count is updated");
                            }
                    })

                    }
                })
                // console.log(num);
                // 
            }
            else {
                var sql = "INSERT INTO `LMS`.`Book` (`Name`,`ISBN`,`Category` ,`Edition`,`Shelf_no`,`Row_no`,`Count`) VALUES ('" + Name + "','" + ISBN + "','" + Cat + "','" + Edition + "','" + Shelf_no + "','" + Row_no + "','" + Copies+ "')";
                mysqlConnection.query(sql, (err, rows, fields) => {
                    if (err) {
                        res.send(err);
                        //console.log(err);
                    }
                    else {
                        res.status(200).send("Book is inserted");
                    }
                })
                //check this author is present in table or not . if present then pick their id and put in book-author table
                // mysqlConnection.query("SELECT * from Author WHERE Name = '" + Author + "'",(err,result_author)=>{
                //     if(err)
                //     {
                //         res.status(400).send(err);
                //     }
                //     else
                //     {
                //         if(result_author.length>0)

                //     }
                // })
            }
        })


    } catch (err) {
        console.log(err);
    }

})

// Delete the data from existing database Table
Router.delete("/Del_book", (req, res) => {
    
    var num = req.body.ISBN; 
    console.log(num);
    
    var sql = "DELETE FROM Book WHERE ISBN = '" + num + "'";
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
//show the details of book
Router.get("/show", (req, res) => {
    var num = req.body.ISBN; 
    mysqlConnection.query("SELECT * from Book WHERE ISBN = '" + num + "'", (err, rows, fields) => {
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

// apis for member who has two only borrow and return the book.

Router.post("/borrow", (req, res) => {
    var ISBN = req.body.ISBN;
    var Date = req.body.Date; 
    console.log(ISBN,Date);
    mysqlConnection.query("SELECT * from Book WHERE ISBN = '" + ISBN + "'", (err,result) => {
        if (!err) {
            console.log(result[0]);
            if(result[0].Count>0)
            {
                // get the user id by decoding the token 
                // const token = req.headers["x-access-token"];
                // const decoded = jwt.verify(token, process.env.TOKEN_KEY);
                // console.log(decoded.user_id);
                var decoded="sim@gmail.com";
                var id;
                mysqlConnection.query("SELECT Id from User WHERE Email = '" + decoded + "'",(err,result_m)=>{
                    if(err)
                    {
                        res.status(400).send(err);
                    }
                    else
                    {
                        console.log(result_m[0].Id,result[0].Id);
                        id = result_m[0].Id;
                        var sql ="INSERT INTO `LMS`.`Transaction` (`Book_id` ,`User_id`,`Borrow_date`,`Status`) VALUES ('"+result[0].Id+"','"+result_m[0].Id+"','"+ Date+"','active')"

                    }

                })

                //insert the data into transaction table 
            }
            else
            {
                res.status(200).send("book is not available right now")
            }
        }
        else {
            res.send(err);
            console.log(err);
        }
    })

})


module.exports = Router;
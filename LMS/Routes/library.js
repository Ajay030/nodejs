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
        mysqlConnection.query(`SELECT * from User WHERE Email = ${mysqlConnection.escape(Email)}`, (err, result) => {
            console.log(result);
            if (err) {
                throw err;
            } else if (result.length >= 1) {
                res.status(400).send("User Already Exists")
            }
        })

        encryptedPassword = await bcrypt.hash(Password, 10);

        var sql = "INSERT INTO `LMS`.`User` (`F_name`, `L_name`,`Email`,`Password` ,`Join_date`,`Role`) VALUES ('" + F_name + "','" + L_name + "','" + Email + "','" + encryptedPassword + "','" + Join_date + "','" + Role + "')";
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
        mysqlConnection.query(`SELECT Password from User WHERE Email = ${mysqlConnection.escape(Email)}`, (err, result) => {
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

        console.log(Name, ISBN, Cat, Edition, Shelf_no, Row_no, Author);

        // Validate  input
        if (!(Name && ISBN && Cat && Edition && Shelf_no && Row_no && Author)) {
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
                        var ans = "UPDATE `LMS`.`Book` SET `Count` = '" + Copies + "' + '" + result_c[0].Count + "' WHERE (`ISBN` = '" + ISBN + "')";
                        mysqlConnection.query(ans, (err, rows, fields) => {
                            if (err) {
                                res.status(400).send(err);
                                //console.log(err);
                            }
                            else {
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
                //insert the book into table with checking wheather the place is filled or not.
                mysqlConnection.query("SELECT ISBN from Book where Shelf_no = '" + Shelf_no + "' and Row_no='" + Row_no + "' ", (err, result_shelf) => {
                    if (err) {
                        res.status(400).send(err);
                    }
                    else {
                        console.log(result_shelf.length);
                        if (result_shelf.length > 1) {
                            res.status(400).send("this is place is already occupied");
                        }
                        else {
                            var sql = "INSERT INTO `LMS`.`Book` (`Name`,`ISBN`,`Category` ,`Edition`,`Shelf_no`,`Row_no`,`Count`) VALUES ('" + Name + "','" + ISBN + "','" + Cat + "','" + Edition + "','" + Shelf_no + "','" + Row_no + "','" + Copies + "')";
                            mysqlConnection.query(sql, (err) => {
                                if (err) {
                                    res.send(err);
                                    //console.log(err);
                                }
                                else {
                                    //res.status(200).send("Book is inserted");
                                    console.log("book is inserted");
                                }
                            })
                        }
                    }

                })

                //check this author is present in table or not . if present then pick their id and put in book-author table
                mysqlConnection.query("SELECT * from Author WHERE Name = '" + Author + "'", (err, result_author) => {
                    if (err) {
                        res.status(400).send(err);
                    }
                    else {
                        if (result_author.length > 0) // auhtor is already present in author table
                        {
                            mysqlConnection.query("SELECT Id from Book WHERE ISBN = '" + ISBN + "'", (err, result_bookid) => {
                                if (err) {
                                    res.status(400).send(err);
                                }
                                else {
                                    mysqlConnection.query("INSERT INTO `LMS`.`Book_author` (`Book_id`,`Author_id`) VALUES('" + result_bookid[0].Id + "','" + result_author[0].Id + "')", (err) => {
                                        if (err) {
                                            res.status(400).send(err)
                                        }
                                        else {
                                            res.status(200).send("auhtor_book updated ");
                                        }
                                    })
                                }
                            })
                        }
                        else {

                            // insert the author name into author table;
                            mysqlConnection.query("INSERT INTO `LMS`.`Author` (`Name`) VALUES('" + Author + "')", (err) => {
                                if (err) {
                                    res.status(200).send(err);
                                }
                                else {
                                    console.log("author name is add in book");
                                }
                                // retrive the auhtor id from table 
                                var auth_id;
                                mysqlConnection.query("SELECT Id from Author WHERE Name = '" + Author + "'", (err, result_auth) => {
                                    if (err) {
                                        res.status.send(err);
                                    }
                                    else {
                                        console.log(result_auth[0].Id);
                                        auth_id = result_auth[0].Id;
                                    }
                                })

                                //get the book id and insert both book id and author id in book author table;
                                mysqlConnection.query("SELECT Id from Book WHERE ISBN = '" + ISBN + "'", (err, result_bookid) => {
                                    if (err) {
                                        res.status(400).send(err);
                                    }
                                    else {
                                        console.log(auth, result_bookid[0].id);
                                        mysqlConnection.query("INSERT INTO `LMS`.`Book_author` (`Book_id`,`Author_id`) VALUES('" + result_bookid[0].Id + "','" + auth_id + "')", (err) => {
                                            if (err) {
                                                res.status(400).send(err)
                                            }
                                            else {
                                                res.status(200).send("auhtor_book updated ");
                                            }
                                        })
                                    }
                                })
                            })

                        }

                    }
                })
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


    mysqlConnection.query("SELECT Id FROM Book WHERE ISBN = '" + num + "'", (err, result) => {
        if (err) {
            res.status(400).send(err);
        }
        else {
            console.log(result[0].Id)
            mysqlConnection.query("DELETE FROM Book_author WHERE Book_id = '" + result[0].Id + "'", (err) => {
                if (err) {
                    res.status(400).send(err);
                }
                else {
                    res.status(200).send("deletion success");
                }
            })
        }
    })

    var sql = "DELETE FROM Book WHERE ISBN = '" + num + "'";
    mysqlConnection.query(sql, (err, rows, fields) => {
        if (!err) {
            //res.send(rows);
            //res.send("deletion success from ");
            console.log('deletion success from book table');
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

Router.post("/transaction", auth, async (req, res) => {

    var book_id = req.body.Book_id;

    var transaction_type = req.body.Transaction_type;
    const transaction_on = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var count;
    mysqlConnection.query("SELECT Count from Book WHERE Id = '" + book_id + "'", (err, result) => {
        if (err) {
            res.status(400).send(err);
        }
        else {

            count = result[0].Count;
            console.log(count);
        }
    })
    //decode token and get the mail;
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    console.log("secoded" + decoded.user_id);
    var user_mail = decoded.user_id;

    //get user_id from the mail
    var user_id;
    mysqlConnection.query("SELECT Id from User where Email = '" + user_mail + "'", (err, result) => {
        if (err) {
            res.status(400).send(err);
        }

        else {
            console.log(result[0].Id);
            user_id = result[0].Id;
            let sql;
            console.log("decoded " + user_id);
            if (transaction_type === 'borrow') {
                sql = 'INSERT INTO Transaction (Id_book, User_id, Borrow_date,Status) VALUES ("' + book_id + '", "' + user_id + '", "' + transaction_on + '","' + transaction_type + '")';
                mysqlConnection.query(sql, (err) => {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        mysqlConnection.query("UPDATE `LMS`.`Book` SET `Count` = '" + count + "'+ '" + -1 + "'  WHERE (`Id` = '" + book_id + "')", (err) => {
                            if (err) {
                                res.status(400).send(err);
                            }
                            else {
                                res.send(`Book ${transaction_type}ed successfully`);
                            }
                        })
                    }
                });
            } else if (transaction_type === 'return') {
                sql = 'INSERT INTO Transaction (Id_book, User_id, Borrow_date,Status) VALUES ("' + book_id + '", "' + user_id + '", "' + transaction_on + '","' + transaction_type + '")';
                mysqlConnection.query(sql, (err) => {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        mysqlConnection.query("UPDATE `LMS`.`Book` SET `Count` = '" + count + "'+ '" + +1 + "'  WHERE (`Id` = '" + book_id + "')", (err) => {
                            if (err) {
                                res.status(400).send(err);
                            }
                            else {
                                res.send(`Book ${transaction_type}ed successfully`);
                            }
                        })
                    }
                });
            } else {
                res.status(400).send('Invalid transaction type');
                return;
            }
        }
    })


})


module.exports = Router;
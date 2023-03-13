require("dotenv").config();
const express = require("express");
const Router = express.Router();
const mysqlConnection = require('../database/connection');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const auth_role = require("../middleware/auth_role.js");

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

        // Validate user input
        if (!(Email && Password && F_name && Join_date && L_name)) {
            res.status(400).send("All input is required");
        }
        mysqlConnection.query(`SELECT * from User WHERE Email = ${mysqlConnection.escape(Email)}`, (err, result) => {
            if (err) {
                throw err;
            } else if (result.length >= 1) {
                res.status(400).send("User Already Exists")
            }
        })

        encryptedPassword = await bcrypt.hash(Password, 10);

        var sql = "INSERT INTO `LMS`.`User` (`F_name`, `L_name`,`Email`,`Password` ,`Join_date`) VALUES ('" + F_name + "','" + L_name + "','" + Email + "','" + encryptedPassword + "','" + Join_date + "')";
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
                res.status(200).json(token);
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
        mysqlConnection.query(`SELECT * from User WHERE Email = ${mysqlConnection.escape(Email)}`, (err, result) => {
            console.log("hi" + result);
            if (err) {
                throw err;
            } else if (result.length == 0) {
                console.log("User does not exists!");
                //res.send.json("User does not exists!")
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
                    console.log(result[0].Role);
                    res.status(200).json({ "TOKEN": token, "ROLE": result[0].Role });
                } else {
                    console.log('Invalid Credentails');
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

        mysqlConnection.beginTransaction(function (err) {
            if (err) throw err;

            // check wheather book is present or not if present simple increase the count of
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
                            var ans = "UPDATE `LMS`.`Book` SET `Count` = '" + +1 + "' + '" + result_c[0].Count + "' WHERE (`ISBN` = '" + ISBN + "')";
                            mysqlConnection.query(ans, (err, rows, fields) => {
                                if (err) {
                                    res.status(400).send(err);
                                    //console.log(err);
                                }
                                else {
                                    res.status(200).send({msg:"count update"});
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
                            res.status(200).send(err);
                        }
                        else {
                            console.log(result_shelf.length);
                            if (result_shelf.length > 0) {
                                res.status(200).send({msg:"this is place is already occupied"});
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
                                                    res.status(200).send({msg:"inserted"});
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
        })

    } catch (err) {
        console.log(err);
    }

})

// Delete the data from existing database Table
Router.delete("/Del_book",auth_role, (req, res) => {
    var num = req.body.ISBN;
    mysqlConnection.query("SELECT  * FROM Book WHERE ISBN = '" + num + "'", (err, result) => {
        if (err) {
            res.status(400).send(err);
        }
        if (result.length == 0) {
            res.status(400).send("no book is present ")
        }
        else {
            console.log("id is " + result[0].Id);
            console.log(result[0].Count);
            if (result[0].Count > 1) {
                mysqlConnection.query("UPDATE `LMS`.`Book` SET `Count` = '" + result[0].Count + "'+ '" + -1 + "'  WHERE (`ISBN` = '" + num + "')", (err) => {
                    if (err) {
                        res.status(400).send(err);
                    }
                    else {
                        res.status(200).send({msg:"deletion success"});
                    }
                })
            }
            else {
                mysqlConnection.query("DELETE FROM Book WHERE Id = '" + result[0].Id + "'", (err) => {
                    if (err) {
                        res.status(400).send(err);
                    }
                    else {
                        console.log("book delete succesful");
                        mysqlConnection.query("DELETE FROM Book_author WHERE Book_id = '" + result[0].Id + "'", (err) => {
                            if (err) {
                                res.status(400).send(err);
                            }
                            else {
                                res.status(200).send({msg:"deletion success"});
                            }
                        })
                    }

                })

            }
        }
    })

})
//show the details of book
Router.get("/show", (req, res) => {
    var num = req.body.ISBN;
    mysqlConnection.query("SELECT * from Book ", (err, rows, fields) => {
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
        }
    })
    // decode token and get the mail;
    const token = req.body.TOKEN;
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    var user_mail = decoded.user_id;
    mysqlConnection.query("SELECT Id from User where Email = '" + user_mail + "'", (err, result) => {
        if (err) {
            res.status(400).send(err);
        } else {
            user_id = result[0].Id;
            let sql;
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
                sql = "SELECT Id from Transaction where Id_book='" + book_id + "'";
                mysqlConnection.query(sql, (err, result) => {
                    if (err) {
                        res.status(400).send(err);
                    } else {

                        mysqlConnection.query("UPDATE `Transaction` SET `Status`='return'", (err) => {
                            if (err) {
                                res.status(400).send(err);
                            }
                            else {
                                mysqlConnection.query("UPDATE `LMS`.`Book` SET `Count` = '" + count + "'+ '" + +1 + "'  WHERE (`Id` = '" + book_id + "')", (err) => {
                                    if (err) {
                                        res.status(400).send(err);
                                    }
                                    else {
                                        res.send(`Book ${transaction_type}ed successfully`);
                                    }
                                })
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
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mysqlConnection = require('../database/connection');
const config = process.env;

const verifyToken = (req, res, next) => {
  var token = req.body.TOKEN || req.query.token || req.headers["cookie"];
  console.log(req.headers);
 // token.replace("TOKEN=","");
 token = token.substring(6);
  console.log(token);
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token,  process.env.TOKEN_KEY);
    var user_mail = decoded.user_id;
    mysqlConnection.query("SELECT Role from User where Email = '" + user_mail + "'", (err, result) => {
        if (err) {
            res.status(400).send(err);
        } else {
            const role = result[0].Role;
            if(role==="librarian")
            {
                next();
            }
            else
            {
                return res.status(401).send("Invalid user");   
            }
        }
    });
  } catch (err) {
    //console.log(err);
    return res.status(401).send("Invalid Token");

  }
  //return next();
};

module.exports = verifyToken;

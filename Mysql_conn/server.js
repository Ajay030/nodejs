const express = require('express');
const bodyParser = require("body-parser");
const mysqlConnection = require('./connection');
const PeopleRoutes = require("./routes/people");

var app = express();
app.use(bodyParser.json());

app.use("/people",PeopleRoutes);

// let mysqlConnection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'Edureka',
//     multipleStatements : true
// });

// mysqlConnection.connect(function(err) {
//     if (err) {
//       return console.error('error: ' + err.message);
//     }
  
//     console.log('Connected to the MySQL server.');
//   });
  
app.listen(3000);
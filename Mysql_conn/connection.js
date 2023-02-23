let mysql = require('mysql');
let mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Edureka',
    multipleStatements : true
});

mysqlConnection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
  
    console.log('Connected to the MySQL server.');
  });
  
module.exports = mysqlConnection;
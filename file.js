//create a file 

// var fs = require('fs');

// fs.writeFile('mynewfile1.txt', 'Hello content!', function (err) {
//   if (err) throw err;
//   console.log('Saved!');
// });

//read a file 

// var http = require('http');
// var fs = require('fs');
// http.createServer(function (req, res) {
//   fs.readFile('mynewfile1.txt', function(err, data) {
//     //res.writeHead(200, {'Content-Type': 'text/html'});
//     res.write(data);
//     return res.end();
//   });
// }).listen(8080);

//delete a file

var fs = require('fs');

fs.unlink('mynewfile2.txt', function (err) {
  if (err) throw err;
  console.log('File deleted!');
});
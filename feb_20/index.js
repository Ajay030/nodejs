//creating server with express


// const express = require('express')
// const app = express()
// const port = 3000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.get('/home', (req, res) => {
//     res.send('Hello World! from home page')
//   })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

// creating server without express only nodejs

var http = require('http');

//create a server object:
http.createServer(function (req, res) {
  console.log("server is running")
  res.write('Hello World!'); //write a response to the client
  res.end(); //end the response
}).listen(8080); //the server object listens on port 8080
//creating server with express


// const express = require('express')
// const app = express()
// const port = 3000

// app.post('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.get('/home', (req, res) => {
//     res.send('Hello World! from home page')
//   })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

// HOW POST API WORKS USING POSTMAN 

const express = require('express')
const bodyParser=require('body-parser')
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({extended:false}))

app.use(bodyParser.json)

let people = { people : [{name:"ajay"}] }

app.get('/', (req, res) => {
  res.json(people);
  res.end();
})

app.post('/people', (req, res) => {
    console.log(req.body); 
    res.json(people);
    res.end();
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

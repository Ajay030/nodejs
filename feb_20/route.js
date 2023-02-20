const express = require('express')
const bodyParser=require('body-parser')
const app = express()
const port = 4500

app.use(bodyParser.urlencoded({extended:false}))

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/people', (req, res) => {
    const people=req.body.Name;
    console.log(people) 
    res.json(people);
    res.end();
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

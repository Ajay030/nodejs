require('./database/connection');
const express = require('express');
const bodyParser = require("body-parser");
const libraryroutes = require("./Routes/library");

var app = express();
app.use(bodyParser.json());

app.use("/library",libraryroutes);
  
app.listen(5500);
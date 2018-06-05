var express = require("express");
var bodyParser = require("body-parser");
var api = require("./routes/api");
var exphbs = require('express-handlebars');
var passport = require('passport');
var Strategy = require('passport-http-bearer').Strategy;
const fs = require('fs');
const join = require('path').join;
var mongoose = require("mongoose");
const models = join(__dirname, 'models');
var app = express();
var routers = require("./routes");


// import counter schema first
require("./routes/util/counter-schema");

// Bootstrap models
fs.readdirSync(models)
  .filter(file => ~file.indexOf('.js'))
  .forEach(file => require(join(models, file)));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('views', __dirname + '/views');
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  partialsDir: __dirname+"/views/partials",
  layoutsDir: __dirname+"/views/layouts"
}));
app.set('view engine', 'hbs');

var port = process.env.PORT || 8080;

app.use("/", routers.view)
app.use("/api", routers.api);
app.use(express.static(__dirname+'/public/'));
mongoose.connect("mongodb://localhost/mayofest-member-db");
mongoose.connection
  .on("error", console.log)
  .on("disconnect", function(){
    console.log("We're disconnected");
  })
  .once("open", function(){
    app.listen(port);
    console.log("Magic happens on port: " + port);

  });

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

// Bootstrap models
fs.readdirSync(models)
  .filter(file => ~file.indexOf('.js'))
  .forEach(file => require(join(models, file)));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  partialsDir: "views/partials",
  layoutsDir: "views/layouts"
}));
app.set('view engine', 'hbs');

var port = process.env.PORT || 8080;

app.get("/member", function(req, res){
    scripts = [{script: 'js/member-intake.js'}];
    res.render('home', {scripts: scripts});
});
app.get("/lookup", function(req, res){
  scripts = [{script: "js/admin-lookup.js"}];
  res.render("pages/admin-lookup", {scripts:scripts});
})
app.use("/api", routers.api);
app.use(express.static('public/'));
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

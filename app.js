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

passport.use(new Strategy(
  function(token, cb) {
    api.auth.findToken(token, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      return cb(null, user);
    });
  }));
var port = process.env.PORT || 8080;
var api_router = express.Router();

api_router.get("/member", function(req, res){
  api.members.get_all_members().then(function(result){
    res.json(result);
  });
});
api_router.get("/auth-test",
    passport.authenticate('bearer', { session: false }),
    function(req, res){
      res.json({ username: req.user.username, email: req.user.emails[0].value })
  });
api_router.post("/member", function(req, res){
    console.log("Form values: " + JSON.stringify(req.body));
    data = {
      memberNumber: Math.floor(Math.random() * (9999 - 1) + 1),
      name: req.body.name,
      email: req.body.email,
      address: req.body['address-line2'] + ",\n"
        + req.body['address-line2'] + ",\n"
        + req.body.city + ", "
        + req.body.region + ", "
        + req.body.country + "\n "
        + req.body['postal-code'],
      status: "INACTIVE"
     }

  api.members.add_member(data).then(function(result){
    res.json(result);
  })
});
app.get("/member", function(req, res){
    scripts = [{script: 'js/member-intake.js'}];
    res.render('home', {scripts: scripts});
});

app.use("/api", api_router);
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

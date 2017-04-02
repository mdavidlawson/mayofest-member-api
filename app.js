var express = require("express");
var bodyParser = require("body-parser");
var db = require("./routes/controllers/database-controller.js");
var exphbs = require('express-handlebars');
var formidable = require('formidable');
var fs = require("fs");

var app = express();
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
var api_router = express.Router();

api_router.get("/member", function(req, res){
    db.get_members(function(result){
      res.json(result);
    });
  });
api_router.post("/member", function(req, res){
  // {"name":"test","email":"","address-line1":"","address-line2":"","city":"","region":"","postal-code":"","country":""}
  console.log("Form values: " + JSON.stringify(req.body));
  data = {
    /**
    +==============+==================+======+=====+=========+================+
    | Field        | Type             | Null | Key | Default | Extra          |
    +==============+==================+======+=====+=========+================+
    | id           | int(10) unsigned | NO   | PRI | NULL    | auto_increment |
    | memberNumber | int(10) unsigned | NO   |     | NULL    |                |
    | name         | varchar(255)     | NO   |     | NULL    |                |
    | email        | varchar(255)     | NO   |     | NULL    |                |
    | address      | varchar(255)     | NO   |     | NULL    |                |
    | note         | text             | YES  |     | NULL    |                |
    | status       | varchar(255)     | YES  |     | NULL    |                |
    +==============+==================+======+=====+=========+================+
    */
    memberNumber: Math.floor(Math.random() * (9999 - 1) + 1),
    name: req.body.name,
    email: req.body.email,
    address: req.body['address-line2'] + ",\n" + req.body['address-line2'] + ",\n" + req.body.city + ", " + req.body.region + ", " + req.body.country + "\n " + req.body['postal-code'],
    status: "INACTIVE"
   }

  db.add_member(data, function(result){
    res.json(result);
  })
});
app.get("/member", function(req, res){
    scripts = [{script: 'js/member-intake.js'}];
    res.render('home', {scripts: scripts});
});

app.use("/api", api_router);
app.use(express.static('public/'));
app.listen(port);
console.log("Magic happens on port: " + port);

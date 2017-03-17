var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var db = require("./app/controllers/database-controller.js")

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.get("/members", function(req, res){
  db.get_members(function(result){
    res.json(result);
  });
});

app.use("/api", router);

app.listen(port);
console.log("Magic happens on port: " + port);

// const http = require('http');
// var stripe = require("stripe")(
//   "sk_live_CPhb0RiujRVfPycFRKmk9Byf"
// );
// http.createServer(function(request, response) {
//
//     // 1. Tell the browser everything is OK (Status code 200), and the data is in plain text.
//     response.writeHead(200, {
//         'Content-Type': 'text/plain'
//     });
//
//     // 2. Write the announced text to the body of the page
//     charges = stripe.balance.listTransactions();
//     item_count = 0;
//     charges.then(function(data){
//       for (index in data.data){
//         response.write("Item:" + (++item_count) + "\n");
//         str_charge = JSON.stringify(data.data[index]);
//         response.write(str_charge + "\n");
//       }
//
//       // 3. Tell the server that all of the response headers and body have been sent
//       response.end();
//
//     })
//
// }).listen(1337);
//
// function download_all_the_data(){
//   charges = stripe.charges.retrieve("ch_57e6db2ae3df28942b8649e8", {
//     api_key: "sk_live_CPhb0RiujRVfPycFRKmk9Byf"
//   });
//   return charges;
// }

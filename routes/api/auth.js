var db = require("../util/database-controller.js");
var exports = module.exports;

exports.authenticate = function(req, res){
  res.json({ username: req.user.username, email: req.user.emails[0].value })
}

exports.findToken = function(token, cb){
  // TODO implement
  // process.nextTick(function(){
  //   db.get_token(token, function(result){
  //     if (! result){
  //       console.log("Undefined response")
  //       return cb(null, null);
  //     }
  //     console.log("Response is valid: " + result);
  //     return cb(null, result);
  //   });
  // });
}

var db = require("../util/database-controller.js");
exports.findToken = function(token, cb){
  process.nextTick(function(){
    db.get_token(token, function(result){
      if (! result){
        console.log("Undefined response")
        return cb(null, null);
      }
      console.log("Response is valid: " + result);
      return cb(null, result);
    });
  });
}

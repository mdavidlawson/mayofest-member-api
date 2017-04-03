var db = require("../util/database-controller.js");

module.exports = {
  get_all_members: function(callback){
    return db.get_members(callback)
  },
  get_member: function(memberNumber){

  },
  add_member: function(data, callback){
    return db.add_member(data, callback);
  }
}

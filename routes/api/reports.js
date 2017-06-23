var mongoose = require("mongoose");

var exports = module.exports;

exports.getCountOfCheckedInMembers = function(req, res){
    var Member = mongoose.model("Member");
    Member.count({checkinStatus: true}).exec().then(function(data){
      res.json(data);
    });
}
exports.getCountOfActiveMembers = function(req, res){
    var Member = mongoose.model("Member");
    Member.count({status: "ACTIVE"}).exec().then(function(data){
      res.json(data);
    });
}
exports.getActiveMemberEmailInfo = function(req, res) {
    var Member = mongoose.model("Member");
    Member.find({status: "ACTIVE"}, "name email").exec().then(function(data){
      res.json(data);
    });
}
exports.getActiveMemberEmailMailingList = function(req, res){
    var Member = mongoose.model("Member");
    var mailingList = "";
    Member.find({status: "ACTIVE"}, "email").exec().then(function(data){
      for (index in data) {
        mailingList += data[index]["email"] + ";"
      }
      res.send(mailingList);
    });

}

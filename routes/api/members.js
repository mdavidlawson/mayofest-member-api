var mongoose = require("mongoose");

var exports = module.exports;

exports.getAllMembers = function(req, res){
  _getAllMembers().then(function(result){
    res.json(result);
  });
}
exports.addMember = function(req, res){
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

  _addMember(data).then(function(result){
    res.json(result);
  })
};

// internal functions
// TODO potentially move into model functions?
function _getAllMembers(){
  var Member = mongoose.model("Member");
  return Member.find({}).exec();
}
function _getMemberByNumber(memberNumber){
  var Member = mongoose.model("Member");
  return Member.find({memberNumber: memberNumber}).exec();
}
function _addMember(data){
  var Member = mongoose.model("Member");
  var newMember = Member(data);
  return newMember.save();
}

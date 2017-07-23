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
exports.getSubscribersEmailMailingList = function(req, res){
    var Member = mongoose.model("Member");
    var mailingList = "";
    // Member.find({
    //   $and[
    //     {newsletterConsent:true},
    //     {status:{$ne:"BANNED"}}
    //   ]}, "email")
    Member.find({"newsletterConsent":true}).and({status:{$ne:"BANNED"}})
    .exec().then(function(data){
      for(index in data) {
        mailingList += data[index]["email"] + ";";
      }
      res.send(mailingList);
    })
}
exports.getBillingData = function(req, res) {
  var Member = mongoose.model("Member");
  return Member.find({}).populate({
    path: "orderNumberForMember",
    select: "orderNumber ssOrderId lineItemsForOrder",
    populate: {
      path: "lineItemsForOrder"
    }
  }).exec().then(function(data){
    res.json(data);
  });
}
exports.getOrphanedOrders = function(req, res) {
  var Order = mongoose.model("Order");
  return Order.find({memberNumber: -1}).populate("lineItemsForOrder")
    .exec()
    .then(function(data){
      res.json(data);
    });
}
exports.getLinkedOrders = function(req, res) {
  var Order = mongoose.model("Order");
  return Order.find({memberNumber: {$ne: -1}}).populate("lineItemsForOrder")
    .exec()
    .then(function(data){
      res.json(data);
    });
}

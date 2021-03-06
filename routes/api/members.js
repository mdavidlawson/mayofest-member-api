var mongoose = require("mongoose");

var exports = module.exports;

exports.getAllMembers = function(req, res){
  _getAllMembers().then(function(result){
    res.json({"data":result});
  });
}
exports.getMemberById = function(req, res){
  var id = req.params.id;
  _getMemberByID(id).then(function(result){
    res.json({"data": result});
  });
}
exports.getMemberByOrderNumber = function(req, res){
  var orderNumber = req.params.orderNumber;
  _searchMembersByCriteria({"orderNumber": Number(orderNumber)}).then(function(result){
    res.json({"data": result});
  });
}
exports.getMemberByEmail = function(req, res){
  var email = req.params.email;
  _getMemberByEmail(email).then(function(result){
    res.json({"data": result});
  })
}
exports.deleteMemberById = function(req, res){
  var id = req.params.id;
  _deleteMemberByID(id).then(function(result){
    res.json({"data": result});
  });
}
exports.deleteAllMembers = function(req, res){
  _deleteAllMembers().then(function(result){
    res.json({"data": result});
  })
}
exports.saveNewMember = function(req, res){
    console.log("Form values: " + JSON.stringify(req.body));
  _saveNewMember(req.body).then(function(result){
    res.json(result);
  }, function(error){
    res.status(500).send(error.message);
  })
};
exports.updateMember = function(req, res){
    console.log("Form values: " + JSON.stringify(req.body));
  _updateMember(req.params.id, req.body).then(function(result){
    res.json(result);
  })
};
exports.checkoutAllMembers = function(req, res){
  console.log("Checkout all members...")
  _bulkCheckoutMembers().then(function(result){
    res.json(result);
  }, function(error){
    res.status(500).send(error.message);
  })
}
exports.deactivateAllMembers = function(req, res){
  console.log("Deactivating All Members");
  _bulkSetMemberStatus("INACTIVE").then(function(result){
    res.json(result);
  }, function(error){
    res.status(500).send(error.message);
  })
}
// internal functions
// TODO potentially move into model functions?
function _getAllMembers(){
  var Member = mongoose.model("Member");
  return Member.find({}).populate({
    path: "orderNumberForMember",
    select: "orderNumber ssOrderId "
  }).exec();
}
function _searchMembersByCriteria(criteria){
  var Member = mongoose.model("Member");
  return Member.find(criteria).populate({
    path: "orderNumberForMember",
    select: "orderNumber ssOrderId"
  }).exec();
}
function _getMemberByID(id){
  var Member = mongoose.model("Member");
  return Member.findById(id).populate({
    path: "orderNumberForMember",
    select: "orderNumber ssOrderId"
  }).exec();
}
function _getMemberByEmail(email){
  return _searchMembersByCriteria({"email":email});
}
function _deleteMemberByID(id){
  var Member = mongoose.model("Member");
  return Member.findById(id).remove();
}
function _deleteAllMembers(){
  var Member = mongoose.model("Member");
  return Member.find({}).remove();
}
function _getMemberByNumber(memberNumber){
  var Member = mongoose.model("Member");
  return Member.find({memberNumber: memberNumber}).populate({
    path: "orderNumberForMember",
    select: "orderNumber ssOrderId"
  }).exec();
}
function _saveNewMember(data){
  console.log("Adding: ", data);
  var Member = mongoose.model("Member");
  var newMember = Member(data);
  return newMember.save();
}
function _updateMember(id, data){
  console.log("Updating ID: ", id);
  var Member = mongoose.model("Member");
  return Member.findOneAndUpdate({_id:id}, data);
}
function _bulkCheckoutMembers(){
  var Member = mongoose.model("Member").collection.initializeOrderedBulkOp();
  Member.find({}).update({$set: {checkinStatus: false}});
  return Member.execute();
}
function _bulkSetMemberStatus(newStatus){
  var Member = mongoose.model("Member").collection.initializeOrderedBulkOp();
  Member.find({}).update({$set: {status: newStatus}});
  return Member.execute();
}

var mongoose = require("mongoose");

var exports = module.exports;

exports.getAllLineItems = function(req, res){
  _getAllLineItems().then(function(data){
    res.json({data: data});
  });
}
exports.saveNewLineItem = function(req, res){
    console.log("Form values: " + JSON.stringify(req.body));
  _saveNewLineItem(req.body).then(function(result){
    res.json(result);
  }, function(error){
    res.status(500).send(error.message);
  })
};
exports.deleteAllLineItems = function(req, res){
  _deleteAllLineItems().then(function(result){
    res.json({"data": result});
  })
}
exports.getAllLineItemsByOrderNumber = function(req, res){
  _getAllLineItemsByOrderNumber(req.params.orderNumber).then(function(result){
    res.json(result);
  }, function(error){
    res.status(500).send(error.message);
  });
}
function _getAllLineItems(){
    var LineItem = mongoose.model("LineItem");
    return LineItem.find({}).populate("orderForLineItem").exec();
}
function _deleteAllLineItems(){
  var LineItem = mongoose.model("LineItem");
  return LineItem.find({}).remove();
}
function _saveNewLineItem(data){
  console.log("Adding: ", data);
  var LineItem = mongoose.model("LineItem");
  var newLineItem = LineItem(data);
  return newLineItem.save();
}
function _getAllLineItemsByOrderNumber(orderNumber) {
  var LineItem = mongoose.model("LineItem");
  return LineItem.find({}).populate({
    path: "orderForLineItem",
    match: {orderNumber: orderNumber},
    select: 'orderNumber'
  }).exec();
}

var mongoose = require("mongoose");

var exports = module.exports;

exports.getAllOrders = function(req, res){
  _getAllOrders().then(function(data){
    res.json({data: data});
  });
}
exports.saveNewOrder = function(req, res){
    console.log("Form values: " + JSON.stringify(req.body));
  _saveNewOrder(req.body).then(function(result){
    res.json(result);
  }, function(error){
    res.status(500).send(error.message);
  })
};
exports.findByOrderNumber = function(req, res){
  console.log("Finding by order number: " + req.params.orderNumber);
  _getOrderByOrderNumber(req.params.orderNumber).then(function(result){
    res.json(result);
  }, function(error){
    res.status(500).send(error.message);
  })
}
exports.deleteAllOrders = function(req, res){
  _deleteAllOrders().then(function(result){
    res.json({"data": result});
  })
}
function _getAllOrders(){
    var Order = mongoose.model("Order");
    return Order.find({}).exec();
}
function _getOrderByOrderNumber(orderNumber){
  var Order = mongoose.model("Order");
  return Order.findOne({"ssOrderId": orderNumber})
}
function _saveNewOrder(data){
  console.log("Adding: ", data);
  var Order = mongoose.model("Order");
  var newOrder = Order(data);
  return newOrder.save();
}
function _deleteAllOrders(){
  var Order = mongoose.model("Order");
  return Order.find({}).remove();
}

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
function _getAllOrders(){
    var Order = mongoose.model("Order");
    return Order.find({}).exec();
}

function _saveNewOrder(data){
  console.log("Adding: ", data);
  var Order = mongoose.model("Order");
  var newOrder = Order(data);
  return newOrder.save();
}

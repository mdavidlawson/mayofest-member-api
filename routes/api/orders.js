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
exports.saveNewOrderLineItems = function(req, res){
    console.log("Form values: " + JSON.stringify(req.body));
  _saveNewOrder(req.body["order"],req.body["lineItems"]).then(function(result){
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
exports.updateOrder = function(req, res){
  console.log("Updating order " + req.params.id + " -> " + JSON.stringify(req.body))
  _updateOrder(req.params.id, req.body).then(function(result){
    res.json(result);
  }, function(error){
    res.status(200).send(error.message);
  });
}
function _getAllOrders(){
    var Order = mongoose.model("Order");
    return Order.find({})
      .populate("lineItemsForOrder")
      .populate({path: "memberForOrder", select: "memberNumber memberNumber"})
      .exec();
}
function _getOrderByOrderNumber(orderNumber){
  var Order = mongoose.model("Order");
  return Order.findOne({"ssOrderId": orderNumber})
    .populate({
      path: "lineItemsForOrder"
    })
    .populate({
      path: "memberForOrder",
      select: "memberNumber memberNumber"
    })
    .exec();
}
// function _saveNewOrder(order){
//   console.log("Adding: ", order);
//   var Order = mongoose.model("Order");
//   var newOrder = Order(order);
//   return newOrder.save();
// }
function _saveNewOrder(order, lineItems){
  console.log("Adding: ", order);
  var Order = mongoose.model("Order");
  var newOrder = Order(order);
  return newOrder.save().then(function(savedOrder){
    var LineItem = mongoose.model("LineItem")
    var allLineItems = [];
    for (index in lineItems){
      var lineItem = lineItems[index];
      var newLineItem = LineItem(lineItem);
      newLineItem.orderForLineItem = savedOrder._id;
      allLineItems[index] = newLineItem.save();
      newOrder.lineItemsForOrder.push(newLineItem);
    }
    allLineItems.push(newOrder.save());
    return Promise.all(allLineItems);
  });
}
function _deleteAllOrders(){
  var Order = mongoose.model("Order");
  return Order.find({}).remove();
}
function _updateOrder(id, data){
  console.log("Updating ID: ", id);
  var Order = mongoose.model("Order");
  return new Promise(function(resolve, reject){
    Order.findOneAndUpdate({_id:id}, data).then(resolve, reject);
  });
}

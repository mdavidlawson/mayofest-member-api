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
function _getAllLineItems(){
    var LineItem = mongoose.model("LineItem");
    return LineItem.find({}).exec();
}

function _saveNewLineItem(data){
  console.log("Adding: ", data);
  var LineItem = mongoose.model("LineItem");
  var newLineItem = LineItem(data);
  return newLineItem.save();
}

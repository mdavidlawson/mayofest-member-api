
var exports = module.exports;
exports.init = function(req, res){
  scripts = [{script: "js/admin-lookup.js"}];
  res.render("pages/admin-lookup", {scripts:scripts});
}

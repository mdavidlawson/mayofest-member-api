var express = require("express");
var api = require("./api");
var pages = require("./pages");
var passport = require('passport');
var Strategy = require('passport-http-bearer').Strategy;

// API Paths
var api_router = express.Router();

passport.use(new Strategy(
  function(token, cb) {
    api.auth.findToken(token, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      return cb(null, user);
    });
  }));

/** API Routes **/

// Members
api_router.get("/member", api.members.getAllMembers);
api_router.get("/members", api.members.getAllMembers);
api_router.get("/member/:id", api.members.getMemberById);
api_router.delete("/member/:id", api.members.deleteMemberById);
api_router.delete("/members", api.members.deleteAllMembers);
api_router.post("/member", api.members.saveNewMember);
api_router.put("/member/:id", api.members.updateMember);

// Orders
api_router.get("/order", api.orders.getAllOrders);
api_router.get("/order/orderNumber/:orderNumber", api.orders.findByOrderNumber);
api_router.get("/orders", api.orders.getAllOrders);
api_router.post("/order", api.orders.saveNewOrder);
api_router.delete("/orders", api.orders.deleteAllOrders);

// LineItems
api_router.get("/lineitems", api.lineitems.getAllLineItems);
api_router.get("/lineitem", api.lineitems.getAllLineItems);
api_router.post("/lineitem", api.lineitems.saveNewLineItem);
api_router.delete("/lineitems", api.lineitems.deleteAllLineItems);

// Auth
api_router.get("/auth-test", passport.authenticate('bearer', { session: false }), api.auth.authenticate);

// view Paths
var view_router = express.Router();
view_router.get("/member", pages.members.init);
view_router.get("/kiosk", pages.kiosk.init);
view_router.get("/lookup", pages.lookup.init)

var exports = module.exports
exports.api = api_router;
exports.view = view_router;

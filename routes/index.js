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
api_router.get("/member/email/:email", api.members.getMemberByEmail);
api_router.get("/member/orderNumber/:orderNumber", api.members.getMemberByOrderNumber);
api_router.delete("/member/:id", api.members.deleteMemberById);
api_router.delete("/members", api.members.deleteAllMembers);
api_router.post("/member", api.members.saveNewMember);
api_router.put("/member/:id", api.members.updateMember);
api_router.get("/member/operations/checkoutAllMembers", api.members.checkoutAllMembers);
api_router.get("/member/operations/deactivateAllMembers", api.members.deactivateAllMembers);

// Orders
api_router.get("/order", api.orders.getAllOrders);
api_router.get("/order/orderNumber/:orderNumber", api.orders.findByOrderNumber);
api_router.get("/order/memberNumber/:memberNumber", api.orders.findByMemberNumber);
api_router.get("/orders", api.orders.getAllOrders);
api_router.post("/order", api.orders.saveNewOrderLineItems);
api_router.delete("/orders", api.orders.deleteAllOrders);
api_router.put("/order/:id", api.orders.updateOrder);

// LineItems
api_router.get("/lineitems", api.lineitems.getAllLineItems);
api_router.get("/lineitem", api.lineitems.getAllLineItems);
api_router.get("/lineitem/orderNumber/:orderNumber", api.lineitems.getAllLineItemsByOrderNumber);
api_router.post("/lineitem", api.lineitems.saveNewLineItem);
api_router.delete("/lineitems", api.lineitems.deleteAllLineItems);

// reports
api_router.get("/report/checkedInMembers/count", api.report.getCountOfCheckedInMembers);
api_router.get("/report/activeMembers/count", api.report.getCountOfActiveMembers);
api_router.get("/report/activeMemberEmail/info", api.report.getActiveMemberEmailInfo);
api_router.get("/report/getActiveMemberEmailMailingList/info", api.report.getActiveMemberEmailMailingList);
api_router.get("/report/getSubscribersMailingList/info", api.report.getSubscribersEmailMailingList);
api_router.get("/report/getBillingData/info", api.report.getBillingData);
api_router.get("/report/getOrphanedOrders/info", api.report.getOrphanedOrders);
api_router.get("/report/getLinkedOrders/info", api.report.getLinkedOrders);

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

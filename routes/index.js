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
api_router.get("/member", api.members.getAllMembers);
api_router.get("/members", api.members.getAllMembers);
api_router.get("/member/:id", api.members.getMemberById);
api_router.delete("/member/:id", api.members.deleteMemberById);
api_router.delete("/members", api.members.deleteAllMembers);
api_router.get("/auth-test", passport.authenticate('bearer', { session: false }), api.auth.authenticate);
api_router.post("/member", api.members.saveNewMember);
api_router.put("/member/:id", api.members.updateMember);

// view Paths
var view_router = express.Router();
view_router.get("/member", pages.members.init);
view_router.get("/lookup", pages.lookup.init)

var exports = module.exports
exports.api = api_router;
exports.view = view_router;

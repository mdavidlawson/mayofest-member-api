var mongoose = require("mongoose");


module.exports = {
  get_all_members: function(){
    var Member = mongoose.model("Member");
    return Member.find({}).exec();
  },
  get_member: function(){
    var Member = mongoose.model("Member");
    return Member.find({memberNumber: memberNumber}).exec();
  },
  add_member: function(data){
    var Member = mongoose.model("Member");
    var newMember = Member(data);
    return newMember.save().exec();
  }
}

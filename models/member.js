var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var MemberSchema = new Schema({
    id    : ObjectId,
    memberNumber: {
      type: Number,
      index:true,
      default: _generateMemberNumber(),
      unique: true
    },
    name: String,
    email: String,
    note: String,
    status: {
      type: String,
      require: true,
      default: "INACTIVE"
    }
});
console.log("Registering member");
mongoose.model("Member", MemberSchema);

function _generateMemberNumber(){
  return Math.floor(Math.random() * (9999 - 1) + 1)
}

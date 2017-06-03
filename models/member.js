var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var MemberSchema = new Schema({
    id    : ObjectId,
    memberNumber: {type: Number, index:true},
    name: String,
    email: String,
    note: String,
    status: String
});
console.log("Registering member");
mongoose.model("Member", MemberSchema);

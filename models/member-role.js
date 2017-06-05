var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var MemberRoleSchema = new Schema({
    id: ObjectId,
    memberNumber: Number,
    role: String
});
mongoose.model("MemberRole", MemberRoleSchema);

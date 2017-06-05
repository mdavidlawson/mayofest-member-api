var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var MemberRoleSchema = new Schema({
    id: ObjectId,
    memberNumber: {type: Number, required: true},
    role: {type: String, required:true}
});
// TODO Add index here for uniqueness. 
mongoose.model("MemberRole", MemberRoleSchema);

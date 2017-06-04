var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Counter = mongoose.model("counter");

var MemberSchema = new Schema({
    id    : ObjectId,
    memberNumber: {
      type: Number,
      index:true,
      require: true,
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
MemberSchema.pre('save', function(next) {
    var document = this;
    Counter.findByIdAndUpdate({_id: 'entityId'}, {$inc: { seq: 1} }, {new: true, upsert: true}).then(function(count) {
        console.log(JSON.stringify(count));
        document.memberNumber = count.seq;
        next();
    })
    .catch(function(error) {
        console.error("counter error-> : "+error);
        throw error;
    });
});
var Member = mongoose.model("Member", MemberSchema);

function _generateMemberNumber(){
  return Math.floor(Math.random() * (9999 - 1) + 1)
}

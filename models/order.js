var mongoose = require('mongoose');
require('mongoose-double')(mongoose);

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    SchemaTypes = mongoose.Schema.Types;

var OrderSchema = new Schema({
    id: ObjectId,
    ssOrderId: {type: Number, required: true},
    timestamp: {type: Date, default: new Date()},
    memberNumber: Number,
    lineItemsForOrder:[{type: Schema.Types.ObjectId, ref: "LineItem"}]

},{ toJSON: { virtuals: true }, toObject: {virtuals: true} });
OrderSchema.virtual("memberForOrder", {
  ref: 'Member', // The model to use
  localField: 'memberNumber', // Find people where `localField`
  foreignField: 'memberNumber', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: true
});

//OrderSchema.index({ssOrderId: 1, { unique: true }});
mongoose.model("Order", OrderSchema);

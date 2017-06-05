var mongoose = require('mongoose');
require('mongoose-double')(mongoose);

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    SchemaTypes = mongoose.Schema.Types;

var OrderSchema = new Schema({
    id: ObjectId,
    ssOrderId: {type: Number, require: true},
    memberNumber: {type: Number, require: true},
    timestamp: {type: Date, default: new Date()}
});
OrderSchema.index({ssOrderId: 1, memberNumber: 1}, { unique: true });
mongoose.model("Order", OrderSchema);

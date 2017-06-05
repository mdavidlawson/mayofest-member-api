var mongoose = require('mongoose');
require('mongoose-double')(mongoose);

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    SchemaTypes = mongoose.Schema.Types;

var LineItemSchema = new Schema({
    id: ObjectId,
    orderId: {type: Number, required: true},
    item: String,
    qty: Number,
    price: SchemaTypes.Double,
    fufillmentStatus: String
});
mongoose.model("LineItem", LineItemSchema);

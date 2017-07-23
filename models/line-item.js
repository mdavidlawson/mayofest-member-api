var mongoose = require('mongoose');
require('mongoose-double')(mongoose);

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    SchemaTypes = mongoose.Schema.Types;

var LineItemSchema = new Schema({
    id: ObjectId,
    item: String,
    qty: Number,
    price: SchemaTypes.Double,
    fufillmentStatus: String,
    variation: String,
    orderForLineItem:[{type: Schema.Types.ObjectId, ref: "Order"}]
},{ toJSON: { virtuals: true } });
mongoose.model("LineItem", LineItemSchema);

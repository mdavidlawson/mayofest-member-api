var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
    // CREATE TABLE `member` (
    //   `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    //   `memberNumber` int(10) unsigned NOT NULL,
    //   `name` varchar(255) NOT NULL,
    //   `email` varchar(255) DEFAULT NULL,
    //   `note` text,
    //   `status` varchar(255) DEFAULT NULL,
    //   PRIMARY KEY (`id`)
    // ) ENGINE=MyISAM DEFAULT CHARSET=latin1;
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

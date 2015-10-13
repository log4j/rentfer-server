var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');
var ObjectId = Schema.ObjectId;


var OrderSchema = new Schema({
    ordernum: {
        type: String
    },
    status :{
        type: Number  
    },
    user :{
        type: ObjectId  
    },
    apartment: {
        type: ObjectId
    },
    room: [ObjectId],
    documents: [String],
    filecopy :[String],
    create_at: {
        type: Date,
        default: Date.now
    },
    update_at: {
        type: Date,
        default: Date.now
    }
});




/*
GroupSchema.index({
    name: 1
}, {
    unique: false
});
*/

mongoose.model('Order', OrderSchema);
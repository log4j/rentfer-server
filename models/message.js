var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');
var ObjectId = Schema.ObjectId;


var MessageSchema = new Schema({
    from: {
        type: ObjectId
    },
    to :{
        type: ObjectId  
    },
    type :{
        type: Number,
        default: 1
    },
    title: {
        type: String
    },
    content: {
        type: String
    },
    read: {
        type: Boolean,
        default: false
    },
    image: {
        type: Boolean,
        default: false
    },
    create_at: {
        type: Date,
        default: Date.now
    },
    read_at: {
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

mongoose.model('Message', MessageSchema);
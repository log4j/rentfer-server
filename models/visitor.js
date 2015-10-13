var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');
var ObjectId = Schema.ObjectId;


var VisitorSchema = new Schema({
    address: {
        type: String
    },
    domain: {
        type: String
    },
    time: {
        type: Date,
        default: Date.now
    }
});

VisitorSchema.index({
    time: 1
}, {
    unique: false
});


mongoose.model('Visitor', VisitorSchema);
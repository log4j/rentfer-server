var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');
var ObjectId = Schema.ObjectId;


var SecondhandSchema = new Schema({
    user: {
        type: ObjectId
    },
    title: {
        type: String
    },
    type: {
        type: String
    },
    images: [String],
    price: {
        type: Number
    },
    location: {
        type: String  
    },
    sold: {
        type: Boolean,
        default: false
    },
    delete: {
        type: Boolean,
        default: false
    },
    description: {
        type: String
    },
    create_at: {
        type: Date,
        default: Date.now
    },
    update_at: {
        type: Date,
        default: Date.now
    }
});

SecondhandSchema.index({
    create_at: 1
}, {
    unique: false
});


mongoose.model('Secondhand', SecondhandSchema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');
var ObjectId = Schema.ObjectId;


var TipSchema = new Schema({
    creator: {
        type: ObjectId
    },
    title :{
        type: String  
    },
    type :{
        type: Number,
        default: 1
    },
    language: {
        type: String
    },
    feature_image: {
        type: String
    },
    paragraph: [Schema.Types.Mixed],
    comment: [Schema.Types.Mixed],
    view_amount: {
        type: Number,
        default: 0
    },
    fav_amount: {
        type: Number,
        default: 0
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




/*
GroupSchema.index({
    name: 1
}, {
    unique: false
});
*/

mongoose.model('Tip', TipSchema);
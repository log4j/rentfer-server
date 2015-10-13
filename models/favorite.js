var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');
var ObjectId = Schema.ObjectId;


var FavoriteSchema = new Schema({
    type: {
        type: String
    },
    title :{
        type: String  
    },
    user :{
        type: ObjectId  
    },
    image: {
        type: String
    },
    item_id :{
        type: ObjectId  
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

mongoose.model('Favorite', FavoriteSchema);
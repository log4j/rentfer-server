var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');
var ObjectId = Schema.ObjectId;


var ApartmentSchema = new Schema({
    name: {
        type: String
    },
    longitude :{
        type: Number  
    },
    latitude :{
        type: Number  
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    zipcode :{
        type: String
    },
    desc :{
        type: String
    },
    tags :{
        type: String
    },
    image: {
        type: String
    },
    rents: [Schema.Types.Mixed],
    facilities: [Schema.Types.Mixed],
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

mongoose.model('Apartment', ApartmentSchema);
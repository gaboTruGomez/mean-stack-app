/*
    File used to create the DB schema/model
*/
var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    rating : {
        type : Number,
        min : 0,
        max : 5,
        required : true
    }, 
    review : {
        type : String,
        required : true
    },
    createdOn : {
        type : Date,
        "default" : Date.new
    }
});

var roomSchema = new mongoose.Schema({
    type : String,
    number : Number,
    description : String,
    photos : [String],
    price : Number
});

var hotelSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    stars : {
        type : Number,
        min : 0,
        max : 5,
        default : 0
    },
    services : [String],
    description : String,
    photos : [String],
    currency : String,
    reviews : [reviewSchema],
    rooms : [roomSchema],
    location : {
        address : String,
        // Always store coordinates as longitude-latitude order
        coordinates : {
            type : [Number],
            index : '2dsphere'
        }
    }
});

// This defines the model of the schema created above, so
// app can use model and insert/update records in DB
// ...model(model_name, model_schema, collection_in_db_to_use)
mongoose.model('Hotel', hotelSchema, 'hotels');
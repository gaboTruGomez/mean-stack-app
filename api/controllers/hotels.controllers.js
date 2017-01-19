//var dbConn = require('../data/dbconnection.js');
//var hotelData = require('../data/hotel-data.json');
//var ObjectId = require('mongodb').ObjectId;

// Mongoose requirements
var mongoose = require('mongoose');
var hotel = mongoose.model('Hotel');

var runGeoQuery = function(req, res) {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);

    if (isNaN(lng) || isNaN(lat))
    {
        res
            .status(400)
            .json({
                "message" : "Latitude and Longitude are not in correct format"
            })
    }

    // a geoJSON point
    var point = {
        type : "Point",
        coordinates : [lng, lat]
    };

    // maxDistance is measured in meters
    // num is max number of records to get back from mongoDB
    var geoOptions = {
        spherical : true,
        maxDistance : 2000,
        num : 5
    };

    // geoNear is a mongoose method to check mongoDB DB for recrods close to 
    // point and geoOptions
    hotel
        .geoNear(point, geoOptions, function(err, results, stats) 
        {
            var response = {
                status : 200,
                message : results
            }
            if (err)
            {
                response.status = 400;
                response.message = err;
            }
            else if (!results)
            {
                response.status = 404;
                response.message = {"message" : "Couldn't find any hotels"};
            }
            console.log('Geo results', results);
            console.log('Geo stats', stats);
            res
                .status(response.status)
                .json(response.message);
        });
};

module.exports.hotelsGetAll = function (req, res) {
    //var db = dbConn.get();
    // var collection = db.collection('hotels');

    var offset = 0;
    var count = 5;
    var maxCount = 10;

    if (req.query && req.query.lat && req.query.lng)
    {
        runGeoQuery(req, res);
        return;
    }

    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset, 10);
    }

    if (req.query && req.query.count) {
        count = parseInt(req.query.count, 10);
    }

    // Error trapping 
    if (isNaN(offset) || isNaN(count))
    {
        res
            .status(400)
            .json({
                "message" : "Count or offset should be numbers"
            })
        return;
    }

    if (count > maxCount)
    {
        res
            .status(400)
            .json(
                {
                    "message" : "Count limit of " + maxCount + " exceeded"
                }
            );
        return;
    }

    // This method is used in conjunction with mongoose to retrieve
    // DB "model" out of DB and send (respond) to browser with hotel data
    hotel
        .find()
        .skip(offset)
        .limit(count)
        .exec(function(err, data){
            if (err) {
                // 500 status code means error in server 
                console.log("Error finding hotels");
                res
                    .status(500)
                    .json(err);
            }
            else 
            {
            console.log("Found hotels", data.length);
            res    
                .json(data);
            }
        });

    /* (**)
        This method works to get a specific collection ('hotels')
        out of mongoDB database set in dbconnection.js file
        and using an async callback function to maximize efficiency
    */
    /*
    collection
        .find()
        .skip(offset)      // limit() & skip() same functionality as slice()
        .limit(count)
        .toArray(function (err, docs) {
            console.log("Found hotels", docs);
            res
                .status(200)
                .json(docs);
        });*/

    //  console.log("db", db);

    //console.log("GET the hotels");
    //console.log(req.query);

    /*
    This works with json data that exists already in project explorer, 
    for implementation of db, use code above (**)
    */
    // var returnData = hotelData.slice(offset, offset + count);

    //   res 
    //     .status(200)
    //   .json( returnData );
};

module.exports.hotelsGetOne = function (req, res) {
    //var db = dbConn.get();
    //var collection = db.collection('hotels');

    var hotelId = req.params.hotelId;
    console.log("GET hotelId", hotelId);

    // Code to use mongoose to get hotel data (one hotel)
    // out of DB (with its model) and send (respond) to browser
    hotel
        .findById(hotelId)
        .exec(function (err, doc) {
            var response = {
                status : 200,
                message : doc
            }
            if (err)
            {
                console.log("Error getting the Hotel");
                response.status = 500;
                response.message = err;
            }
            else if (!doc)
            {
                response.status = 404;
                response.message = {"message" : "Hotel ID not found"};
            }
            res
                .status(response.status)
                .json(response.message);
            
        });

    /*
        this method findOne() is used to find just one document
        out of the db, and using the helper driver from mongodb called
        ObjectId we can search for the _id in DB and return the doc 
    */
    /*
    collection
        .findOne({
            _id: ObjectId(hotelId)
        }, function (err, doc) {
            res
                .status(200)
                .json(doc);
        });
    */
    /*
    var thisHotel = hotelData[hotelId];
    res
        .status(200)
        .json(thisHotel);
        */
};

// Helper function in order to split string into array of strings
// Used to create services and photos values.
var _splitArray = function(input) {
    var output;
    if (input && input.length > 0)
    {
        output = input.split(";");
    }
    else 
    {
        output = [];
    }
    return output;
}

module.exports.hotelsAddOne = function (req, res) {
    //This code is to be used WITH mongoose
    hotel   
        .create({
            name: req.body.name,
            description: req.body.description,
            stars: parseInt(req.body.stars, 10),
            services: _splitArray(req.body.services),
            photos: _splitArray(req.body.photos),
            currency: req.body.currency,
            location: {
                address: req.body.address,
                coordinates: [
                    parseFloat(req.body.lng),
                    parseFloat(req.body.lat)]
            }
        }, function(err, hotelDocAdded) {
            if (err)
            {
                console.log("Error creating hotel");
                res
                    .status(400)
                    .json(err);
            }
            else 
            {
                console.log("Hotel created", hotelDocAdded);
                res
                    .status(201)
                    .json(hotelDocAdded);
            }
        });

    



    // This code is to be used without mongoose (it is native-driver code implementation)
    /*
    var db = dbConn.get();
    var collection = db.collection('hotels');

    var newHotel;

    console.log("POST new hotel");

    /*
        This if-statement is used to validate that POST body contains values
        of its body, name and stars fields, then it parses stars value to a integer
        and insertOne(dataToBeStored, callbackFunction) is async, and response.ops
        holds actual data that was stored (if no err was present)
        status(201) is confirmation code that something was updated/inserted
    
    if (req.body && req.body.name && req.body.stars) {
        newHotel = req.body;
        newHotel.stars = parseInt(req.body.stars, 10);

        collection.insertOne(newHotel, function (err, response) {
            console.log(response.ops);
            res
                .status(201)
                .json(response.ops);

        });
    }
    else {
        console.log("Data missing from body");
        res
            .status(400)
            .json({ message: "Required data missing from body" });
    }
    */
};

/*
    This is a PUT request, only use PUT when wanting to update 
    entire document, not just partial, if you want partial updates
    (i.e. hotel's name), then use PATCH (if supported) or POST.
    Common use for PUT is first getting whole document in form fashion with
    a GET request and then send back whole document back to DB with PUT request.
*/
module.exports.hotelsUpdateOne = function(req, res) {

}
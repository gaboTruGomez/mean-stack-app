var mongoClient = require('mongodb').MongoClient;
var dburl = 'mongodb://localhost:27017/hotel';

var _connection = null;


var open  = function() {
    mongoClient.connect(dburl, function(err, db) {
        if (err) {
            console.log("DB Connection failed");
            return;
        }
        _connection = db;
        console.log("DB Connection open", db);
    });
};

var get = function() {
    return _connection;
};

module.exports = {
    open : open, 
    get : get
};
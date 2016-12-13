/*
    File created to handle DB connection with mongoose instead of mongodb
*/
var mongoose = require('mongoose');
var dburl = 'mongodb://localhost:27017/hotel';

mongoose.connect(dburl);

mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + dburl);
});

mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected');
});

mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error: ' + err);
});

// Bring in schemas and models
require('./hotels.model.js');

/*
    This functions are to disconnect of mongoose by terminating apd
    and nodemon can restart again (if user wants to);
    this only works with UNIX type OS ( not Windows :( )
*/
/*
process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        console.log('Mongoose disconnected thorugh app termination (SIGINT)');
        process.exit(0);
    });
});

process.on('SIGTERM', function() {
    mongoose.connection.close(function() {
        console.log('Mongoose disconnected thorugh app termination (SIGTERM)');
        process.exit(0);
    });
});

process.once('SIGUSR2', function() {
    mongoose.connection.close(function() {
        console.log('Mongoose disconnected thorugh app termination (SIGUSR2)');
        process.kill(process.pid, 'SIGUSR2');
    });
});
*/

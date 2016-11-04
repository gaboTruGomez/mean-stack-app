//console.log("It works!");

var express = require('express');
var app = express();
// needed to see path of (static) files in server 
var path = require('path');

var routes = require("./api/routes");

// bodyParser is used to handle post-form (meaning, POST requests from client)
// this because express can't natively handle post-form requests
var bodyParser = require('body-parser');

// setting express variables
app.set('port', 3000);

// setting which port app (express) will listen for events
// note: app.listen() is an async function
/*
app.listen(app.get('port'), function() {
    console.log("Magic happens on port " + app.get('port'));
});
*/

/*
 Method to create a HTTP.GET, using as first parameter
 the URL where user will enter (/ means homepage, landing page),
 and second the callback function that will be executed
 once the method is finished, req contains stuff about request, 
 res contains stuff about response 
*/
/*
app.get('/', function(req, res) {
    console.log("GET the homepage");
    // used to set the HTTP status response code manually 
    // res.status(404);
    res.send("Express yourself");
});
*/

/*
    app.use() is middleware, meaning it is run 
    between the request and response, middleware is executed
    in the same order as put in the code
    Note: pass in as first parameter in callback, if it is like that,
    then request will only log the requests made to that specific directory,
    otherwise will log every request
*/
/*app.use('/css', function(req, res, next) {
    console.log(req.method, req.url);
    next();
});*/
app.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

// This approach is to create the static folder 'public'
// and also, when browser requests at root of page ('/index.html')
// it will look in that static folder and the html and will send it back
// note, if browser request is to root ('/'), express will look for index.html
// as predefined
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/public', express.static(path.join(__dirname, 'public')));

/*
app.get('/', function(req, res) {
    console.log("GET the homepage");

    res
        .status(200)
        .sendFile(path.join(__dirname, 'public', 'index.html'));
        // stating directory like this prevents crashes between
        // different OS, like linux (\) and Windows (/)...
});
*/

// Use this middleware (bodyParser) to get post-form request body
// extended : false is used to only get access to strings and json data
// if set to true, other data types will be accessible (not commonly used)
app.use(bodyParser.urlencoded({ extended : false }));

// This creates url ('/api/url_specified_in_routes.js') 
// that will GET json from routes.js file
app.use('/api', routes);

/*
app.get('/json', function(req, res) {
    console.log("GET the json");
    // used to set the HTTP status response code manually 
    res
        .status(200)
        .json( {"jsonData" : true} );
});
*/

/*
// To send file to browser, use responseObject.sendFile()
// path.join() is used to find and join the directory and name of file to be send
// __dirname is used to find working directory (i.e. where this file is located),
// then join that with fileName and it will be send to the browser as static file
app.get('/file', function(req, res) {
    console.log("GET the file");
    // used to set the HTTP status response code manually 
    res
        .status(200)
        .sendFile(path.join(__dirname, 'app.js'));
});
*/

var server = app.listen(app.get('port'), function() {
    var port = server.address().port;
    console.log("Magic happens on port " + port);
});

// This is to verify that app.listen() runs async
//console.log('Me first!!');
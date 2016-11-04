var express = require('express');
var router = express.Router();
var ctrlHotels = require('../controllers/hotels.controllers.js');

/*
 This file is to have better organization of routes (urls) in server
 GET is the method that will "send" stuff to the url specified ('/json')
 POST is the method that when app/browser uses POST method, will run 
        server's POST method and will send back ('{jsonData : POST received}')' 
*/
router.route('/hotels').get(ctrlHotels.hotelsGetAll);

router.route('/hotels/:hotelId').get(ctrlHotels.hotelsGetOne);

router.route('/hotels/new').post(ctrlHotels.hotelsAddOne);

/*
router.route('/json').get(function(req, res) {
    
    console.log("GET the json");
    res 
        .status(200)
        .json( {'jsonData' : true} );
});
*/
/*
    .post(function(req, res){
        console.log("POST the json route");
        res 
            .status(200)
            .json( {"jsonData" : "POST received"} );
    });*/

module.exports = router;
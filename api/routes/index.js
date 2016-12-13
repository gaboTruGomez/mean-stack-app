var express = require('express');
var router = express.Router();
var ctrlHotels = require('../controllers/hotels.controllers.js');
var ctrlReviews = require('../controllers/reviews.controllers.js');

/*
 This file is to have better organization of routes (urls) in server
 GET is the method that will send/receive stuff to the url specified ('/json')
 POST is the method that when app/browser uses POST method, will run 
        server's POST method and will send back ('{jsonData : POST received}')' 
*/
// This is used in conjunction with mongoose for a better/cleaner
// implementation of get/post methods in a single route.
router.route('/hotels')
    .get(ctrlHotels.hotelsGetAll)
    .post(ctrlHotels.hotelsAddOne);

router.route('/hotels/:hotelId').get(ctrlHotels.hotelsGetOne);

//router.route('/hotels/new').post(ctrlHotels.hotelsAddOne);

router.route('/hotels/:hotelId/reviews').get(ctrlReviews.reviewsGetAll);

router.route('/hotels/:hotelId/reviews/:reviewId').get(ctrlReviews.reviewsGetOne);

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
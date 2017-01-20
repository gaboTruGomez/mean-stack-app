var mongoose = require('mongoose');
var hotel = mongoose.model('Hotel');

module.exports.reviewsGetAll = function (req, res) {
    var hotelId = req.params.hotelId;
    console.log("GET hotelId, ReviewId", hotelId);

    hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function (err, doc) {
            if (err)
            {
                console.log("Error finding hotel");
                res
                    .status(500)
                    .json(err);
            }
            else if (!doc)
            {
                console.log("Hotel id " + id + " not found in DB");
                res
                    .status(404)
                    .json({
                        "message" : "Hotel ID " + id +  " not found" 
                    });
            }
            else 
            {
                console.log("Returned doc", doc);
                res
                    .status(200)
                    .json(doc.reviews ? doc.reviews : []);
            }
        });
};

module.exports.reviewsGetOne = function (req, res) {
    var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;
    console.log("GET reviewId " + reviewId + " for hotelId" + hotelId);
    
    hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function (err, hotel) {
            if (err)
            {
                res
                    .status(500)
                    .json(err);
            }
            else if (!hotel)
            {
                res
                    .status(404)
                    .json({"message": "Couldn't find review for that hotel"});
            }
            console.log("Returned hotel", hotel);
            var review = hotel.reviews.id(reviewId);
            res
                .status(200)
                .json(review);
        });
};

var _addReviews = function(req, res, hotelDoc)
{
    // push() is a JS proper function
    hotelDoc.reviews.push({
        name: req.body.name,
        rating: parseInt(req.body.rating, 10),
        review: req.body.review
    });

    hotelDoc.save(function(err, hotelUpdated) {
        var response = {
            status: 201,
            message: ""
        };
        if (err)
        {
            response.status = 500;
            response.message = err;
        }
        else 
        {
            // This will return the last review of the hotel instance,
            // the last review is ALWAYS the review you added to the reviews array
            response.message = hotelUpdated.reviews[(hotelUpdated.length - 1)];
        }
        res
            .status(response.status)
            .json(response.message);
    });
}

module.exports.reviewsAddOne = function (req, res) {
    var hotelId = req.params.hotelId;
    console.log("GET hotelId, ReviewId", hotelId);

    hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function (err, doc) {
            if (err)
            {
                console.log("Error finding hotel");
                res
                    .status(500)
                    .json(err);
            }
            else if (!doc)
            {
                console.log("Hotel id " + hotelId + " not found in DB");
                res
                    .status(404)
                    .json({
                        "message" : "Hotel ID " + hotelId +  " not found" 
                    });
            }
            if (doc)
            {
                _addReviews(req, res, doc);
            }
        });
}

module.exports.reviewsUpdateOne = function(req, res) {
    var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;

    console.log("GET hotelId and updating Review", hotelId, reviewId);

    hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function(err, doc) {
            var response = {
                status : 200,
                message : doc
            };
            if (err)
            {
                console.log("Error finding hotel");
                response.status = 500;
                response.message = err;
            }
            else if (!doc)
            {
                console.log("Hotel ID " + hotelId + " not found in DB.");
                response.status = 404;
                response.message = {
                    "message" : "Hotel ID not found"
                };
            }

            if (response.status !== 200)
            {
                res
                    .status(response.status)
                    .json(response.message);
            }
            else 
            {
                var review = doc.reviews.id(reviewId);
                review.name = req.body.name;
                review.rating = parseInt(req.body.rating, 10);
                review.review = req.body.review;

                doc.save(function(err, updatedReviewOfHotel) {
                    if (err)
                    {
                        res
                            .status(500)
                            .json(err);
                    }
                    else 
                    {
                        res
                            .status(204)
                            .json();
                    }
                });
            }
        });
}

module.exports.reviewsDeleteOne = function(req, res)
{
    var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;
    console.log("DELETE review with hotelId", hotelId);

    hotel
        .findById(hotelId)
        .exec(function(err, hotelDoc) {
            var response = {
                status : 200,
                message : hotelDoc
            };

            if (err)
            {
                console.log("Error finding hotel");
                response.status = 500;
                response.message = err;
            }
            else if (!hotelDoc)
            {
                console.log("Hotel with ID " + hotelId + " wasn't found");
                response.status = 404;
                response.message = {
                    "message" : "Hotel not found"
                };
            }
            else 
            {
                var review = hotelDoc.reviews.id(reviewId);
                if (!review)
                {
                    response.status = 404;
                    response.message = {
                        "message" : "Review ID not found " + reviewId
                    };
                }
            }

            if (response.status !== 200)
            {
                res
                    .status(response.status)
                    .json(response.message);
            }
            else
            {
                hotelDoc.reviews.id(reviewId).remove();
                hotelDoc.save(function(err, hotelUpdated) {
                    if (err)
                    {
                        res
                            .status(500)
                            .json(err);
                    }
                    else 
                    {
                        res
                            .status(204)
                            .json();
                    }
                })
            }
        });
}
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
                res
                    .status(500)
                    .json(err);
            }
            console.log("Returned doc", doc);
            res
                .status(200)
                .json(doc.reviews);
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
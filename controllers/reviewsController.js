// const catchAsync = require(`${__dirname}/../Utilites/catchAsync`)
const Review = require(`${__dirname}/../models/reviewModel`)
const factory = require('./Factory')

// CRUD functions
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.createReview=factory.createOne(Review);
exports.getReview = factory.getOne(Review);
exports.getReviews = factory.getAll(Review);

// Program related functions
exports.setTourUserIds = (req,res,next)=>{
    //nested route
    if(!req.body.tour) req.body.tour = req.params.tourId
    if(!req.body.user) req.body.user = req.user.id
    next();
}

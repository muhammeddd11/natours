
const catchAsync = require(`${__dirname}/../Utilites/catchAsync`)
const Review = require(`${__dirname}/../models/reviewModel`)

exports.createReview=catchAsync(async (req,res,next)=>{
    const newReview = await Review.create(req.body)
    res.status(201).json({
        status:"success",
        message:"Your review has been created",
        review:{
            newReview
        }
    })
})
exports.getReviews = catchAsync(async(req,res,next)=>{
    const reviews = await Review.find()
    res.status(200).json({
        status:"success",
        message:"All reviews has been retrieved",
        length:reviews.length
        ,reviews:{
            reviews
        }
    })
})
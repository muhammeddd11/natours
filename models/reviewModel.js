const mongoose = require('mongoose');
const Tour = require('./tourModel')
const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, "We cannot save an empty review"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "Please rate the tour"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
        select: false
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, "Review must belong to a user"]
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, "Review must belong to a tour"]
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

reviewSchema.pre(/^find/, function (next) {
    this.populate({ path: "user", select: "name usename" }).populate({ path: 'tour', select: "name" })
    //we cam select specific properties to only populated , select: "name" 
    next()
})


reviewSchema.statics.calcAverageRating = async function (tourId) {// in static methood this refere to current model

    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRatong: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ])
    if (stats.length > 0) {

        await Tour.findByIdAndUpdate(tourId, { ratingQuantity: stats[0].nRatong, ratingAverage: stats[0].avgRating })
    } else {

        await Tour.findByIdAndUpdate(tourId, { ratingQuantity: 0, ratingAverage: 4.5 })

    }
}

reviewSchema.post('save', function () {
    //this.constructor points to current model
    //this in the middleware points to current document 
    this.constructor.calcAverageRating(this.tour); // post middleware does not have access to next function

})

reviewSchema.pre(/^findOneAnd/, async function (next) {// findOneAnd becuase findByIdDelete,findByIdUpdate are short hand for findOneByIdAndDelete etc..
    this.r = await this.findOne()
    next()

})
// we pass variable r from pre to post by create a property using this called r
reviewSchema.post(/^findOneAnd/, async function () {
    // this.findOne can not work here becuase 
    await this.r.constructor.calcAverageRating(this.r.tour._id)
})
reviewSchema.index({ tour: 1, user: 1 }, { unique: true })


const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;

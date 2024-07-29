const express = require('express')
const reviewController = require(`${__dirname}/../controllers/reviewsController`)
const authController = require(`${__dirname}/../controllers/authController`)
const router = express.Router()

router.route('/').post(reviewController.createReview)/*authController.protect,authController.restrictedTo('user'),*/.get(reviewController.getReviews)
module.exports = router //we should export the router to make the app function
const express = require('express')
const reviewController = require(`${__dirname}/../controllers/reviewsController`)
const authController = require(`${__dirname}/../controllers/authController`)
const router = express.Router({mergeParams:true})

router.route('/:id').delete(reviewController.deleteReview).patch(reviewController.updateReview).get(reviewController.getReview)
router.route('/').post(reviewController.setTourUserIds,reviewController.createReview)/*authController.protect,authController.restrictedTo('user'),*/.get(reviewController.getReviews)
module.exports = router //we should export the router to make the app function
const express = require('express')
const reviewController = require(`${__dirname}/../controllers/reviewsController`)
const authController = require(`${__dirname}/../controllers/authController`)
const router = express.Router({ mergeParams: true })

// protect all routes of reviews
router.use(authController.protect)

router.route('/:id').delete(authController.restrictedTo('user', 'admin'), reviewController.deleteReview).patch(authController.restrictedTo('user', 'admin'), reviewController.updateReview).get(reviewController.getReview)


router.route('/').post(authController.restrictedTo('user'), reviewController.setTourUserIds, reviewController.createReview).get(reviewController.getReviews)

module.exports = router //we should export the router to make the app function
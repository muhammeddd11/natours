const express = require('express')
const authController = require(`${__dirname}/../controllers/authController`)
const tourController = require(`${__dirname}/../controllers/tourController`)
const reviewRouter = require(`${__dirname}/../routes/reviewRouter`)
const router = express.Router();


//router.param('id',tourController.checkId)

//router.route('/:tourId/reviews').post(reviewController.createReview)

router.use('/:tourId/reviews', reviewRouter)

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan)

router
  .route('/topFiveCheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tourStats').get(tourController.getTourStats)
router.route('/').get(authController.protect, tourController.getAllTours).post(authController.protect, authController.restrictedTo('admin'), tourController.addTour);
router.route('/:id').get(authController.protect, tourController.getTour).patch(authController.protect, authController.restrictedTo('admin'), tourController.updateTour).delete(authController.protect, authController.restrictedTo('admin'), tourController.deleteTour);

module.exports = router
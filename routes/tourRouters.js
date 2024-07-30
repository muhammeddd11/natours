const express = require('express')
const authController = require(`${__dirname}/../controllers/authController`)
const tourController = require(`${__dirname}/../controllers/tourController`)
const reviewRouter = require(`${__dirname}/../routes/reviewRouter`)
const router = express.Router();


//router.param('id',tourController.checkId)

//router.route('/:tourId/reviews').post(reviewController.createReview)

router.use('/:tourId/reviews',reviewRouter)

router.route('/monthly-plan').get(tourController.getMonthlyPlan)//not working

router
  .route('/topFiveCheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);//not working
router.route('/tourStats').get(tourController.getTourStats)
router.route('/').get(tourController.getAllTours).post(tourController.addTour);
router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);

module.exports = router
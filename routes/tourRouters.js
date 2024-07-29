const express = require('express')
const authController = require(`${__dirname}/../controllers/authController`)
const tourController = require(`${__dirname}/../controllers/tourController`)
const router = express.Router();


//router.param('id',tourController.checkId)


router.route('/monthly-plan').get(tourController.getMonthlyPlan)//not working

router
  .route('/topFiveCheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);//not working
router.route('/tourStats').get(tourController.getTourStats)
router.route('/').get(tourController.getAllTours).post(tourController.addTour);
router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(authController.protect,authController.restrictedTo('admin',"leg-guide"),tourController.deleteTour);

  module.exports = router
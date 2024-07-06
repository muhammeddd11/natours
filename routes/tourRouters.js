const express = require('express')

const app = express();

app.use(express.json());

const tourController = require(`${__dirname}/../controllers/tourController`)

const router = express.Router();


//router.param('id',tourController.checkId)

router
  .route('/topFiveCheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tourStats').get(tourController.getTourStats)
router.route('/').get(tourController.getAllTours).post(tourController.addTour);
router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);

  module.exports = router
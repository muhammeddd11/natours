const Tour = require('../models/tourModel');
const catchAsync = require('./../Utilites/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'Tours overview',
    tours,
  });
});

exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The forest hiker',
  });
};

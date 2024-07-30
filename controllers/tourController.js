const Tour = require(`${__dirname}/../models/tourModel`);
const catchAsync = require(`${__dirname}/../Utilites/catchAsync`);
const appError = require(`${__dirname}/../Utilites/appError`);
const factory = require('./Factory')


//CRUD functions
exports.addTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
exports.getTour = factory.getOne(Tour,{path:'reviews'})
exports.getAllTours = factory.getAll(Tour);


// Program related functions
exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

exports.getTourStats = catchAsync(async (req, res,next) => {
    
  const stats = await Tour.aggregate([
    {
        $match: { ratingAverage: { $gte: 4.5 } }
    },
    {
        $group: {
            _id: { $toUpper: '$difficulty' },
            numRatings: { $sum: '$ratingsQuantity' },
            numTours: { $sum: 1 },
            avgRating: { $avg: '$ratingsAverage' },
            avgPrice: { $avg: '$price' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
        }
    },
    {
        $sort: { avgPrice: 1 }
    },
    {
        $match: { _id: { $ne: 'EASY' } }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: { stats }
  });

});

exports.getMonthlyPlan = catchAsync(async (req, res,next) => {
    
  const year = req.params.year * 1; // 2021
  
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});
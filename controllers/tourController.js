const Tour = require(`${__dirname}/../models/tourModel`);
const APIFeatures = require(`${__dirname}/../Utilites/apiFeatures`)
exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

exports.getAllTours = async (req, res) => {
    try {
        const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
        const tours = await features.query;
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: { tours }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        if (!tour) {
            return res.status(404).json({ status: 'fail', message: 'Tour not found' });
        }
        res.status(200).json({ status: 'success', data: { tour } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.addTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({ status: 'success', data: { tour: newTour } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!tour) {
            return res.status(404).json({ status: 'fail', message: 'Tour not found' });
        }

        res.status(200).json({ status: 'success', data: { tour } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.deleteTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);

        if (!tour) {
            return res.status(404).json({ status: 'fail', message: 'Tour not found' });
        }

        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(404).json({ status: 'fail', message: err.message });
    }
};
exports.getTourStats = async (req,res)=>{
    try{
        const stats = await Tour.aggregate([
                {
                    $match: { ratingAverage: { $gte: 4.5 } }
                },
                {
                    $group: {
                        _id: {$toUpper:'$difficulty'},
                        numRating:{$sum:'$ratingQuantity'},
                        numTours:{$sum:1},
                        avgRating: { $avg: '$ratingsAverage' },
                        avgPrice: { $avg: '$price' },
                        minPrice: { $min: '$price' },
                        maxPrice: { $max: '$price' }
                    }
                } ,
                {
                    $sort:{
                         avgPrice:1
                    }
                },  // we can repeat stages
                {
                    $match:{
                        _id:{$ne:'EASY'}
                    }
                }
            ]);
        res.status(200).json({
             status: 'success',
              data: {
                 stats 
                } 
            });

    }catch(err){
        res.status(400).json({
            status:"Fail",
            message:err.message
        })
    }
}
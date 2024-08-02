const AppError = require(`${__dirname}/../Utilites/appError`)
const catchAsync = require(`${__dirname}/../Utilites/catchAsync`)
const APIFeatures = require(`${__dirname}/../Utilites/apiFeatures`);

exports.deleteOne = Model =>catchAsync( async (req, res,next) => {
  
    const doc = await Model.findByIdAndDelete(req.params.id);
    
    if (!doc) {
      return next(new AppError('no document found with that id',404));
    }
    res.status(204).json({ status: 'success', data: null });
  
  });
  exports.updateOne = Model => catchAsync(async (req, res,next) => {
  
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true
      });
      if (!doc) {
          return next(new AppError('no document found with that id',404));
      }
    res.status(200).json({ status: 'success', data: { doc } });
  
  });
  exports.createOne = Model => catchAsync(async (req, res,next) => {
  
    const newDoc = await Model.create(req.body);
    res.status(201).json({ status: 'success', data: { data: newDoc } });
  
  });
  exports.getOne = (Model,popOption) => catchAsync(async (req, res,next) => {
    
    let query = Model.findById(req.params.id);
    if(popOption) query = query.populate(popOption)
    const doc = await query; 
    if (!doc) {
        return next(new AppError('no doc found with that id',404));
    }
    res.status(200).json({ status: 'success', data: { doc } });
  
  });
  exports.getAll = Model => catchAsync(async (req, res,next) => {
    // to allow the nested routes in get all reviews 
    let filter={}
    if(req.params.tourId) filter={tour:req.params.tourId}

    // generic function
    const features = new APIFeatures(Model.find(), req.query).filter().sort().limitFields().paginate();
    const doc = await features.query;
    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: { doc }
    });
  
  });
  
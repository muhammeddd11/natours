const User = require(`${__dirname}/../models/userModel`)
const catchAsync = require(`${__dirname}/../Utilites/catchAsync`);

exports.getAllUsers = catchAsync(async (req,res,next) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: { users }
    });
  
})

exports.createUser = (req,res) => {
    res.status(500).json({
        status:"error",
        message:"This route is not yet implemented"
    })
}

exports.getUser = (req,res) => {
    res.status(500).json({
        status:"error",
        message:"This route is not yet implemented"
    })
}

exports.editUser = (req,res) => {
    res.status(500).json({
        status:"error",
        message:"This route is not yet implemented"
    })
}

exports.deleteUser = (req,res) => {
    res.status(500).json({
        status:"error",
        message:"This route is not yet implemented"
    })
}

const { x64 } = require("crypto-js");
const User = require(`${__dirname}/../models/userModel`)
const catchAsync = require(`${__dirname}/../Utilites/catchAsync`);
const AppError = require(`${__dirname}/../Utilites/appError`)
const factory = require('./Factory')

//CRUD functions
exports.editUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);

// Program related function

exports.createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not defined so please use signup instead"
    })
}

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) create error if the user try to update the password 

    if (req.body.password || req.body.passwordConfiramtion) {
        return next(new AppError("Please visit users/updateMyPassword for changing your passwored", 400))

    }

    //2) update the user body

    const updateduser = await User.findByIdAndUpdate(req.user.id, { email: req.body.email, name: req.body.name },
        {
            new: true,
            validators: true
        })

    res.status(200).json({
        status: "success",
        data: {
            updateduser
        }
    })

})

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false })
    res.status(204).json({
        status: "succes"
    })
})

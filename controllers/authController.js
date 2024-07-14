const User = require(`${__dirname}/../models/userModel`)
const catchAsync  = require(`${__dirname}/../Utilites/catchAsync`)
const jwt = require('jsonwebtoken')


exports.signUp = catchAsync(async (req,res,next)=>{
    const newUser = await User.create({
        name:req.body.name,
        username:req.body.username,
        eamil:req.body.email,
        password:req.body.password,
        passwordConfirmation:req.body.passwordConfirmation
    })
    const token = jwt.sign({id:newUser._id},process.env.JWT_secret,{
        expiresIn:process.env.expireIn
    })
    res.status(201).json({
        status:"success",
        token,
        message:"User was created",
        data:{
            user:newUser
        }
    })   
})
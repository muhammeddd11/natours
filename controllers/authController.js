const User = require(`${__dirname}/../models/userModel`)
const catchAsync  = require(`${__dirname}/../Utilites/catchAsync`)
const jwt = require('jsonwebtoken')
const { token } = require('morgan')
const AppError = require(`${__dirname}/../Utilites/appError`)
9
const createToken = id=>{
    return jwt.sign({id:id},process.env.JWT_secret,{
        expiresIn:process.env.expireIn})
}

exports.signUp = catchAsync(async (req,res,next)=>{
    const newUser = await User.create({
        name:req.body.name,
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
        passwordConfirmation:req.body.passwordConfirmation
    })
    const token = createToken(newUser._id)
    res.status(201).json({
        status:"success",
        token,
        message:"User was created",
        data:{
            user:newUser
        }
    })   
})
exports.login = catchAsync(async(req,res,next)=>{
    const {email,password} = req.body
    //1) email and password exist
    if(!email || !password) return next(new AppError("please enter the email and the passord",400))
    //2) check if the password is correct 
    const user = await User.findOne({email:email}).select('+password')
    if(!user || !await user.correctPassowrd(password,user.password)) return next(new AppError("incorrect email or incorrect password",401))
    
    //3)if everything is okay send token to client 
    const token = createToken(user._id)
    res.status(200).json({
        status:"success",
        token
    })
})
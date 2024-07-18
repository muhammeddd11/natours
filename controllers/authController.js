const {promisify} = require('util')
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
exports.protect =catchAsync(async (req,res,next)=>{
    // 1) getting token and check if it's there
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")[1]
    }
    if(!token) return next(new AppError("You should logging in before you can see the tours",401))
    
    // 2) verification the token
    const decoded = await promisify(jwt.verify)(token,process.env.JWT_secret)
    // 3) check if the user still exists
    const freshUser = await User.findById(decoded.id).select('+passwordChangedAt')
    if(!freshUser) return next(new AppError("the user belonging to this token is no longer exists..",401))
    //4) if the user change password after token was issued
    
    //if(freshUser.checkingPassword(decoded.iat)) return next(new AppError("Please login again",401))
    // grant access to protected route    
    req.user = freshUser
    next();
})
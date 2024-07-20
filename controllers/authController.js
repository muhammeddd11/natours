const {promisify} = require('util')
const User = require(`${__dirname}/../models/userModel`)
const catchAsync  = require(`${__dirname}/../Utilites/catchAsync`)
const jwt = require('jsonwebtoken')
const { token } = require('morgan')
const AppError = require(`${__dirname}/../Utilites/appError`)
const sendEmail = require(`${__dirname}/../Utilites/email`)
const crypto = require('crypto')
9
const createToken = id=>{
    return jwt.sign({id:id},process.env.JWT_secret,{
        expiresIn:process.env.expireIn})
}

const createAndSendToken = (user,status,res)=>{
    const token = createToken(user._id)
    const cookieOPtions={
        expires:new Date(Date.now()+process.env.COOKIE_EXPIRES*24*60*60*1000),
        httpOnly:true
    }


    if(process.env.NODE_ENV === 'production') cookieOPtions.secure=true

    res.cookie('JWT',token,cookieOPtions)

    user.password = undefined
    res.status(status).json({
        status:"success",
        data:{
            user
        }
    })   
}


exports.signUp = catchAsync(async (req,res,next)=>{
    const newUser = await User.create({
        name:req.body.name,
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
        passwordConfirmation:req.body.passwordConfirmation,
        role : req.body.role
    })
    createAndSendToken(newUser,201,res)
})
exports.login = catchAsync(async(req,res,next)=>{
    const {email,password} = req.body
    //1) email and password exist
    if(!email || !password) return next(new AppError("please enter the email and the passord",400))
    //2) check if the password is correct 
    const user = await User.findOne({email:email}).select('+password')
    if(!user || !await user.correctPassowrd(password,user.password)) return next(new AppError("incorrect email or incorrect password",401))
    
    //3)if everything is okay send token to client 
    createAndSendToken(user,200,res)

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
exports.restrictedTo = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return(next(new AppError("you dont have permission to carry this action",403)))
        }
        next()
    }
}
exports.forgetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on posted email
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(new AppError('There is no account with this email', 404));
  
    // 2) Produce the reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
  
    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Update your password by visiting this link: ${resetURL}\nIf you did not forget your password, please ignore this email.`;
    console.log(message)
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 minutes)',
        message:message,
      });
  
      res.status(200).json({
        status: 'success',
        message: 'Check your email for the reset link.',
      });
    } catch (err) {
        console.log(err)
    }
    console.log("after try catch block")
  });

exports.resetPassword = catchAsync(async(req,res,next)=>{
    //1) get user based on the token
    const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({resetToken:hashToken,resetTokenExpire:{$gt:Date.now()}})

    //2) if token han not expired and there is user set the new
    if(!user) return next(new AppError("token is invalid or has expired",400))
    
    user.password = req.body.password 
    
    user.passwordConfirmation = req.body.passwordConfirmation
    
    user.resetToken = undefined

    user.resetTokenExpire = undefined

    await user.save()

    //3) update changedAt property for the user

    //4) log the user in and send the token
    const token = createToken(user._id)
    res.status(200).json({
        status:"success",
        token
    })
})

exports.updatePassword=catchAsync(async(req,res,next)=>{
    //1) get user from the collection
    const user = await User.findById(req.user.id).select('+password')
    //2) check if the posted password is corrected
    if(!(await user.correctPassowrd(req.body.passwordCurrent,user.password))){
        return(next(new AppError("Your old Password is not correct",401)))
    }
    //3) if so then update the password
    user.password = req.body.password
    user.passwordConfirmation = req.body.passwordConfirmation
    await user.save()
    //4) log the user in
    createAndSendToken(user,200,res)

})
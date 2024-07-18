const AppError = require(`${__dirname}/../Utilites/appError`)
const handleCast = err =>{
        const message = `Invalid ${err.path} : ${err.value}`
        return new AppError(message,404)
}
const handleToken = err => {return new AppError("invalid token please login again",401)}

const handleExpiration = err => {return new AppError("Please login again",401)}

const handleDuplicate = err =>{
    const message = "Duplicate field value : x. please use another value" 
    return new AppError(message, 400)
}
const handleValidation = err =>{
    const errors = Object.values(err.errors).map(el => el.message)
    const message = `Invaild inputs : ${errors.join(". ")}`
    return new AppError(message,400)
}

const errorDev = (err,res)=>{
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
        stack:err.stack,
        error:err
    })
}
const errorProd = (err,res)=>{
    if(err.isOperational){
        
        res.status(err.statusCode).json({
            status:err.status,
            message:err.message
        })

    }else{ 
        console.error("Error",err)
        if(err)    
        res.status(500).json({
            status:'error',
            message:"Something went wrong"
        })
    }
}


module.exports=(err,req,res,next)=>{
    
    err.statusCode =err.statusCode || 500
    err.status= err.status|| "Error"
    let error = {...err}
    if(process.env.NODE_ENV === "development"){
        errorDev(err,res)
    }else if (process.env.NODE_ENV === "production"){
        if(err.name === "CastError") error = handleCast(err)
        if(err.code === 11000) error = handleDuplicate(err)
        if(err.name === "ValidationError") error = handleValidation(err)
        if(err.name === "JsonWebTokenError") error = handleToken(err)
        if(err.name === "TokenExpiredError") error = handleExpiration(err)
        errorProd(error,res)
    }

}
const express = require('express');
const app = express();
const tourRouter = require(`${__dirname}/routes/tourRouters`);
const userRouter = require(`${__dirname}/routes/userRouter`);
const AppError = require(`${__dirname}/Utilites/appError`)
const GlobalerrorHandler = require(`${__dirname}/controllers/errorController`)




// middlewares
app.use(express.static(`${__dirname}/public`))

app.use(express.json())

app.use((req, res, next) => {
    req.requestTime= new Date().toISOString();
    next();
  });

// routes

app.use('/api/v1/tours',tourRouter)
app.use('/api/v1/users',userRouter)

// handle all undefined routes if we able to reach this point here so request's route not matched others routes
app.all('*',(req,res,next)=>{
    
    next(new AppError(`we can not find ${req.originalUrl} on the server`,400))
}) // if we pass anything in next function it will assume that is a error and pass all next middlewares and go to our global error handling middleware

// central error handling middleware

app.use(GlobalerrorHandler)

module.exports = app

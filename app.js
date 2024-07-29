const express = require('express');
const tourRouter = require(`${__dirname}/routes/tourRouters`);
const userRouter = require(`${__dirname}/routes/userRouter`);
const reviewRouter = require(`${__dirname}/routes/reviewRouter`)
const AppError = require(`${__dirname}/Utilites/appError`)
const GlobalerrorHandler = require(`${__dirname}/controllers/errorController`)
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const app = express();
// middlewares
// security http headers 
app.use(helmet())


// limit requests from the client
const limiter = rateLimit({
  max:100,
  windowMs: 60*60*1000,
  message:"To many requests from this ip please try again in an hour"
})
//comment here

app.use('/api',limiter)//will affect all routes under /api routes limiter is a middleware so we can use app.use
// serving static files
app.use(express.static(`${__dirname}/public`))
//body parser 
app.use(express.json({limit:'10KB'}))

// data sanitization against NoSQL injection
app.use(mongoSanitize());

// data sanitization against XSS
app.use(xss())

// prevent parameter pollution

app.use(hpp({
  whitelist:[
    'duration',
    'ratingQuantity',
    'ratingAverage',
    'maxGroupSize',
    'difficulty'
  ]
}))
// test middleware
app.use((req, res, next) => {
    req.requestTime= new Date().toISOString();
    next();
  });

// routes

app.use('/api/v1/tours',tourRouter)
app.use('/api/v1/users',userRouter)
app.use('/api/v1/reviews',reviewRouter)

// handle all undefined routes if we able to reach this point here so request's route not matched others routes
app.all('*',(req,res,next)=>{
    
    next(new AppError(`we can not find ${req.originalUrl} on the server`,400))
}) // if we pass anything in next function it will assume that is a error and pass all next middlewares and go to our global error handling middleware

// central error handling middleware

app.use(GlobalerrorHandler)//** mes **

module.exports = app

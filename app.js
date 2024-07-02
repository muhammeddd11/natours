const express = require('express');
/*if(process.env.NODE_ENV === 'development'){
    const morgan = require('morgan');
}*/


// to access request's body use express.json in the main app file 

const app = express();

app.use(express.json())

//const fs = require('fs')

//console.log(fs.existsSync(`${__dirname}/routes/userRouter.js`)); // should log true if the file exists
//console.log(fs.existsSync(`${__dirname}/routes/tourRouters.js`)); // should log true if the file exists

const tourRouter = require(`${__dirname}/routes/tourRouters`);
const userRouter = require(`${__dirname}/routes/userRouter`);
//console.log(tours)
//1) middlewares

//app.use(morgan('dev'));
/*app.use((req,res,next)=>{
    console.log("Hello from the middleware")
    next()
})*/
/*app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    next();
})*/
//2) function handle request and response


/*app.get('/api/v1/tours',getAllTours)
app.get('/api/v1/tours/:id',getTour)
app.post('/api/v1/tours',addTour)
app.patch("/api/v1/tours/:id",updateTour)
app.delete("/api/v1/tours/:id",deleteTour)
*/
//3) routes


app.use(express.static(`${__dirname}/public`))

//5) mounting the routers
app.use('/api/v1/tours',tourRouter)
app.use('/api/v1/users',userRouter)
/*app.get('/',(req, res) => {
    res.status(200).send("Hello from the server");
})
app.get('/json',(req,res)=>{
    res.status(200).json({"message":"Hello from the server","App":"natours"});
})
app.post('/',(req,res)=>{
    res.status(200).send("you can post to this endpoint ...");
})*/

module.exports = app

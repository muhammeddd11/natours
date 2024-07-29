// define and requiring modules 
const mongoose = require('mongoose')

const dotenv = require('dotenv')

dotenv.config({path : './config.env'})

process.on("uncaughtException",err=>{// event listening on occurrance of uncaughtException
    console.log(err.name,err.message)
    console.log("Uncaught Exception ")
    process.exit(1)//program stops immediately 
    
})

const app = require('./app')

const port = process.env.port || 3000;// trick to make default value for the variable

// define the linke to data base and replace <PASSWORD> with database password
const DB = process.env.DATABASE_LINK.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)

// connect to database 
mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true

}).then(()=> console.log('DB connected successfully'))

// power up the server 
const server = app.listen(port,()=>{
    console.log(`App is running on port ${port}`);
});


process.on("unhandledRejection",err=>{
    console.log(err.name,err.message)
    console.log("Unhandled rejection ")
    server.close(()=>{// server finishes all the requests first then shutdown
        process.exit(1)
    })
    
})




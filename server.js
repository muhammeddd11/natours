// define and requiring modules 
const mongoose = require('mongoose')

const dotenv = require('dotenv')

dotenv.config({path : './config.env'})

const app = require('./app')

const port = process.env.port;

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
app.listen(port,()=>{
    console.log(`App is running on port ${port}`);
});

console.log(app.get('env'))

console.log(process.env)

//NODE_ENV=development nodemon server.js
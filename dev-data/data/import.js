const mongoose = require('mongoose')

const dotenv = require('dotenv')

dotenv.config({ path: '../../config.env' })

const fs = require('fs');
const { deleteTour } = require('../../controllers/tourController');

const port = process.env.port;

const Tour = require(`${__dirname}/../../models/tourModel`)
const User = require(`${__dirname}/../../models/userModel`)
const Review = require(`${__dirname}/../../models/reviewModel`)


// define the linke to data base and replace <PASSWORD> with database password
const DB = process.env.DATABASE_LINK.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

// connect to database 
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true

}).then(() => console.log('DB connected successfully'))

const tours = JSON.parse(fs.readFileSync('./tours.json', 'utf-8'));
const users = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
const reviews = JSON.parse(fs.readFileSync('./reviews.json', 'utf-8'));



const ImportTours = async () => {

    try {

        await Tour.create(tours)
        await User.create(users, { validateBeforeSave: false })
        await Review.create(reviews)
        console.log("data were successfully added to database")
    } catch (err) {

        console.log(err)
    }
    process.exit()
}


// Deleteing data

const DeleteData = async () => {

    try {

        await Tour.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()

        console.log('All tours were deleted ')
    } catch (err) {

        console.log(err)
    }
    process.exit()
}
if (process.argv[2] === '--import') {
    ImportTours()
} else if (process.argv[2] === '--delete') {
    DeleteData()
} else {
    console.log("PLease specify import or delete ")
}
//console.log(process.argv)
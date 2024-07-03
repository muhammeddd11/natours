const mongoose = require('mongoose')
//define a mongoose schema 

const tourSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Name is required'],
        unique: true,
        trim:true
    },
    ratingAverage:{
        type:Number,
        default:4.5
    },
    price: {
        type:Number,
        required:[true,'Price is required']
        },
    duration:{
        type: Number,
        required:[true,'Duration must be set']
    },
    maxGroupSize:{
        type: Number,
        required:[true,'Tour must have a group size']
    },
    difficulty:{
        type: String,
        required:[true,'Tour must have a difficulty']
    },
    ratingQuantity:{
        type: Number,
        default:0
    },
    discount:Number,
    summary:{
        type:String,
        trim:true,
        required:[true,'tour must have a summary']
    },
    description:{
        type:String,
        trim:true
    },
    imageCover:{
        type:String,
        required:[true,'Tour must have a cover image']
    },
    images:[String],
    createdAt:{
        type:Date,
        defult:Date.now()
    },
    startDates:[Date]
})

// create model(models)

const Tour = mongoose.model('Tour',tourSchema)

// create document (documents)

/*const testTour = new Tour({
    name:'dahab',
    rating:4.9,
    price:600
})

testTour.save().then(doc=>{
    console.log(doc)
}).catch(err=>{
    console.log('document not saved')
})*/

module.exports = Tour
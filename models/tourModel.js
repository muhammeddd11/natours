const mongoose = require('mongoose')
//define a mongoose schema 

const tourSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Name is required'],
        unique: true
    },
    rating:{
        type:Number,
        default:4.5
    },
    price: {
        type:Number,
        required:[true,'Price is required']
        }
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
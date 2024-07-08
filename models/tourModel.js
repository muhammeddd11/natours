const mongoose = require('mongoose')
//define a mongoose schema 
const slugify = require('slugify')

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
    slug:String
    ,
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
        defult:Date.now(),
        select : false
    },
    startDates:[Date],
    secretTour:{
        type:Boolean,
        defualt:false
    }
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})
tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7
})



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


//Document middleware: runs before save and create but no insertmany
tourSchema.pre('save',function(next){
    console.log(this)
    this.slug = slugify(this.name,{lower:true})
    next()
})

// we can have multiple pre nd post middleware (hook)
// post middleware has access to next and document
// middleware execute after and before a certain event

tourSchema.post('save',function(doc){
       // console.log(doc)
})


//

// query middleware

tourSchema.pre(/^find/,function(next){
    this.find({secretTour:{$ne:true}})
    this.start = Date.now();
    next();
})
tourSchema.post(/^find/,function(docs){
    console.log(`Query took ${Date.now() - this.start} milliseconds!` )
})


//aggregation middleware 

tourSchema.pre('aggregate',function(next){
    this.pipeline().unshift({$match:{secretTour:{$ne:true}}})
    console.log(this.pipeline())
    next()
})

// create model(models)


const Tour = mongoose.model('Tour',tourSchema)
module.exports = Tour
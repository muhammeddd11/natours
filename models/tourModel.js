const mongoose = require('mongoose')
//define a mongoose schema 
const slugify = require('slugify')

const validator = require('validator')

const tourSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Name is required'],
        unique: true,
        trim:true,//           muhammed                save it as muhammed
        maxlength:[40 ,'name must have less than or equal 40 characters'],
        minlength:[10,'name must have more than or equal 10 characters']
        //validate:[validator.isAlpha,'Tour name should only contains characters']
    },
    ratingAverage:{
        type:Number,
        default:4.5,
        // validator is a function return either true or false
        min:[1,'rating should be more than or equal 1'],
        max:[5,'rating should be less than or equal 5']
    },
    price: {
        type:Number,
        required:[true,'Price is required']
        },
    duration:{
        type: Number,
        required:[true,'Duration must be set']
    },
    slug:String//do not understand the purpose of it
    ,
    maxGroupSize:{
        type: Number,
        required:[true,'Tour must have a group size']
    },
    difficulty:{
        type: String,
        required:[true,'Tour must have a difficulty'],
        enum:{
            values:['easy','medium','difficult'],
            message:"difficulty either easy , medium or difficult"

        }
    },
    ratingQuantity:{
        type: Number,
        default:0
    },
    discount:{
        type:Number,
        validate:{
            // can make a validator with this keywords only when create new tour
            validator:function(val){
            return val < this.price
        },
        message:"discount value should be less than ({VALUE})"
    }},
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
        default:Date.now,
        select : false// not retreived when quering the data base
    }, 
    startDates:[Date],
    secretTour:{
        type:Boolean,
        default:false
    },
    startLocation:{
        //GEOJSON
        type:{
            type:String,
            default:'Point',
            enum:['Point']
        } ,
        coordinates:[Number],
        address:String,
        description:String
    },
    locations:[
        {
            type:{
                type:String,
                default:'Point',
                enum:['Point']
            } ,
            coordinates:[Number],
            address:String,
            description:String,
            day:Number
        }
    ],
    guides:[{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    }
    ]
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}// do not understand their purpose
})
tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7
})

// virtual populate

tourSchema.virtual('reviews',{
    ref:"Review",
    foreignField:'tour',
    localField:'_id'
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
    this.slug = slugify(this.name,{lower:true})
    next()
})

// we can have multiple pre nd post middleware (hook)
// post middleware has access to next and document
// save and create and not update
// middleware execute after and before a certain event

tourSchema.post('save',function(doc){
       // console.log(doc)
})


//

// query middleware

tourSchema.pre(/^find/,function(next){
    this.populate({
        path:'guides',
        select:'-__v'
      })
    next()
})

tourSchema.pre(/^find/,function(next){
    this.find({secretTour:{$ne:true}})// to hidde all the secret tours
    this.start = Date.now();
    next();
})
tourSchema.post(/^find/,function(docs){
    console.log(`Query took ${Date.now() - this.start} milliseconds!` )//calculate the time taken by the query
})


//aggregation middleware 

tourSchema.pre('aggregate',function(next){
    this.pipeline().unshift({$match:{secretTour:{$ne:true}}})
    //console.log(this.pipeline())
    next()// do not understand its purpose
})

// create model(models)


const Tour = mongoose.model('Tour',tourSchema)
module.exports = Tour
const mongoose = require('mongoose')
const { isLowercase } = require('validator')
const validator = require('validator')
const { default: isEmail } = require('validator/lib/isEmail')
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Users must have names"],
        maxlength:25,
        trim:true
    },
    username:{
        type:String,
        unique:true,
        maxlength:25,
        required:[true,"users must have usernames"],
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:[true,"users must have emails"],
        trim:true,
        lowercase:true,
        validate:[validator.isEmail,"Provide a valid email"]

    },
    photo:String,
    password:{
        type:String,
        require:[true,"password is required"],
        minlength:8,
        select:false
    },
    passwordConfirmation:{
        type:String,
        require:[true,"Please confirm your password"],
        validate:{// custom validators works only on CREATE & SAVE !!!!!!!!!!!!! 
            validator:function (el){
                return el === this.password
            }
        },
        message:"Passwords are not match"
    }

})

userSchema.pre('save',async function(next){

    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password,12)   
    this.passwordConfirmation = undefined // to do not save a field in the database assign it to undefined
    next()
})

userSchema.methods.correctPassowrd= async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword)
}
const User = mongoose.model('User',userSchema)
module.exports=User
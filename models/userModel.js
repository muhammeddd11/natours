const crypto = require('crypto')
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
    role:{
      type:String,
      enum:['admin','user','guid','lead-guide'],
      default:'user'  
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
    },
    passwordChangedAt:Date,
    resetToken:String,
    resetTokenExpire:String

})

userSchema.pre('save',async function(next){

    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password,12)   
    this.passwordConfirmation = undefined // to do not save a field in the database assign it to undefined
    next()
})
userSchema.pre('save',async function(next){

    if(!this.isModified('changePasswordAt') || this.isNew) return next()
    this.changePasswordAt = Date.now() - 1000
})

userSchema.methods.correctPassowrd= async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword)
}
userSchema.methods.checkingPassword= async function(JWTTimestamp){

    if(this.passwordChangedAt){
        const changedpasswordChangedAt = parseInt(this.passwordChangedAt.getTime() / 1000,10)
        return changedpasswordChangedAt > JWTTimestamp
    }

    //means not chandes
    return false
}
userSchema.methods.createPasswordResetToken = function(){
    const token = crypto.randomBytes(32).toString('hex')
    this.resetToken = crypto.createHash('sha256').update(token).digest('hex')
    console.log({token},this.resetToken)
    this.resetTokenExpire = Date.now() + 10 * 60 * 1000
    
    return token

}
const User = mongoose.model('User',userSchema)
module.exports=User
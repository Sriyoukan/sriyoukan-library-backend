var mongoose = require('mongoose')
var crypto = require('crypto')
var Schema = mongoose.Schema

var userSchema = new Schema({
    name: String,
    age: String,
    Id:{type:String, unique:true},
    isAdmin:Boolean,
    // password:String,
    salt : String,
    hash : String
})

userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('base64')
    this.hash = crypto.pbkdf2Sync(password,this.salt,1000,64,'sha512').toString('base64')
}

userSchema.methods.validatePassword = async (password,user)=>{
    newHash = crypto.pbkdf2Sync(password,user.salt,1000,64,'sha512').toString('base64')
    if(newHash===user.hash){
        return true
    }else{
        return false
    }
}

module.exports = mongoose.model('users',userSchema)
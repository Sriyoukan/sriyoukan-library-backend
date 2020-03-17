var mongoose = require('mongoose')
var Schema = mongoose.Schema
var crypto = require('crypto')

var bookSchema = new Schema({
    
    
    title :{type:String,unique:true},
    author: String,
    numberOfCopiesAvailable:Number,
    totalCopies:Number
    
})

bookSchema.methods.reduceCopies = function(){
    this.numberOfCopiesAvailable = numberOfCopiesAvailable - 1
}

module.exports = mongoose.model('book',bookSchema)
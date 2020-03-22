var mongoose = require('mongoose')
var Schema = mongoose.Schema
var crypto = require('crypto')

var reservedBookSchema = new Schema({
    title :{type:String},
    borrower: String,
    onHand:Boolean,
    returnDate:Date
})


module.exports = mongoose.model('reservedBook',reservedBookSchema)
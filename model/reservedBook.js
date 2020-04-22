var mongoose = require('mongoose')
var Schema = mongoose.Schema

var reservedBookSchema = new Schema({
    title: String,
    bookID: String,
    borrower: String,
    reservedDate: Date,
    reserveID: Number
    //onHand:Boolean,
    //penalty:Number,
    //overDue:Boolean
})

module.exports = mongoose.model('reservedBook',reservedBookSchema)
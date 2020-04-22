var mongoose = require('mongoose')
var Schema = mongoose.Schema

var borrowedBookSchema = new Schema({
    title: String,
    bookID: String,
    borrower: String,
    borrowedDate: Date,
    returnDate: Date
    //penalty:Number
})

module.exports = mongoose.model('borrowedBook',borrowedBookSchema)
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var historySchema = new Schema({
    title: String,
    bookID: String,
    reservedDate: Date,
    borrowedDate: Date,
    returnedDate: Date,
    borrower: String
})

module.exports = mongoose.model('history', historySchema)
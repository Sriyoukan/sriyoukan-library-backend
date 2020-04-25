var mongoose = require('mongoose')
var Schema = mongoose.Schema

var reservedBookSchema = new Schema({
    title: String,
    bookID: {type: String, unique: true},
    reservedPerson: String,
    reservedDate: Date,
    lastDateToBorrow: Date // a book can be reserved for max 1 week
})

module.exports = mongoose.model('reservedBook',reservedBookSchema)
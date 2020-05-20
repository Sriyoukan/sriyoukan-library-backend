var mongoose = require('mongoose')
var Schema = mongoose.Schema

var bookSchema = new Schema({
    title :{type:String, unique:true},
    author: String,
    category: String,
    availableCopies: Number,
    totalCopies: Number,
    bookIDs: [String] // unique ID for each book copy
    // have to add (branch) and (image) fields later
})

module.exports = mongoose.model('book',bookSchema)
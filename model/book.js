var mongoose = require('mongoose')
var Schema = mongoose.Schema

var bookSchema = new Schema({
    title :{type:String, unique:true},
    author: String,
    category: String,
    availableCopies: Number,
    totalCopies: Number
    // have to add (branch) and (image) fields later
})

// bookSchema.methods.reduceCopies = function(){
//     this.numberOfCopiesAvailable = numberOfCopiesAvailable - 1
// }

module.exports = mongoose.model('book',bookSchema)
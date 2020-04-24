var express = require('express');
var router = express.Router();
// var bcrypt = require('bcrypt')
// var crypto = require('crypto');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var Book = require('../model/book')
var History = require('../model/history')
var bp = require('body-parser')
router.use(express.json())

// to get book by title
router.get('/book',(req,res,next)=>{
    Book.find({title:req.body.title},(err,data)=>{
        if(err){
            return next(err)
        }else{
            res.status(200).json(data)
        }
    })
})

// to get all books from db
router.get('/allBook',(req,res,next)=>{
    Book.find((err,data)=>{
        if(err){
            return err
        }else{
            res.status(200).json(data)
        }
    })
})

// later
router.post('/uploadfile', upload.single('file'), (req, res, next) => {
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
    res.send(file)
})

// to insert or update an book document
router.post('/addbook', (req, res, next) => {
    async function addBook(request, response){
        const docs = await Book.find({title: request.body.title});
    
        if(docs.length === 0) { // new book
            const book = new Book()
            book.title = request.body.title
            book.author = request.body.author
            book.category = request.body.category

            const copies = Number(request.body.numberOfCopies)
            book.availableCopies = copies
            book.totalCopies = copies

            // create unique ID for each book copy
            let bookArray = [];
            for(i=1; i<=copies; i++) {
                bookArray.push(request.body.title + "_" + String(i));
            }
            book.bookIDs = bookArray

            await book.save((err) => {
                if(err){
                    return err
                }else{
                    return response.send(book)
                }
            })
            console.log("book added successfully");
        }
        else { // already existing book
            const existCopies = docs[0].totalCopies
            const addedCopies = Number(request.body.numberOfCopies)
            docs[0].availableCopies = docs[0].availableCopies + addedCopies
            docs[0].totalCopies = existCopies + addedCopies
            
            // create unique ID for each added book copy
            for(i=1; i<=addedCopies; i++) {
                docs[0].bookIDs.push(request.body.title + "_" + String(existCopies+i));
            }

            await docs[0].save((err) => {
                if(err){
                    return err
                }else{
                    return response.send(docs[0])
                }
            })
            console.log("book updated successfully");
        }
    }

    addBook(req, res);
})

// later
router.post('/search',(req,res,next)=>{
    Book.find({title:{ "$regex": req.body.search, "$options": "i" }},(err,data)=>{
        if(err){
            return err
        }else{
            res.status(200).json(data)
        }
    })
})

// search books by using category
router.get('/category', (req, res, next) => {
    Book.find({category: req.body.category}, (err,data)=>{
        if(err){
            return err
        }else{
            res.status(200).json(data)
        }
    })
})

// to get history of book transactions
router.get('/history', (req, res, next) => {
    History.find((err,data)=>{
        if(err){
            return err
        }else{
            res.status(200).json(data)
        }
    })
})

module.exports = router;
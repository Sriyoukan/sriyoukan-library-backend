var express = require('express');
var router = express.Router();
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

// models
var Book = require('../model/book')
var User = require('../model/user')
var ReservedBook = require('../model/reservedBook')
var History = require('../model/history')

var bp = require('body-parser')
router.use(express.json())

// to get book by title and it additionally send details about book already reserved or not
router.get('/book',(req,res,next)=>{
    async function sendBook(request, response, next) {
        let book = await Book.find({title:request.body.title});
        if (book.length === 0) {
            response.status(200).json(book)
        }
        else {
            const reservedBooks = await ReservedBooks.find({reservedPerson: request.body.userId})
            if (reservedBooks.length === 0){
                response.status(200).json(book)
            }
            else {
                for (i=0; i<reservedBooks.length; i++) {
                    if (reservedBooks[i].title === request.body.title) {
                        book[0].isReserved = true
                        response.status(200).json(book)
                    }
                }
                response.status(200).json(book)
            }
        }
    }

    sendBook(req, res);
})

// to get all books from db and it additionally send details about book already reserved or not
router.get('/allBook',(req,res,next)=>{
    async function sendBook(request, response) {
        let books = await Book.find({})
        const reservedBooks = ReservedBook.find({reservedPerson: request.body.userId})
        if (reservedBooks.length === 0) {
            response.status(200).json(books)
        }
        if (reservedBooks.length === 1) {
            for (i=0; i<books.length; i++) {
                if (reservedBooks[0].title === books[i].title){
                    books[i].isReserved = true
                    response.status(200).json(books)
                }
            }
        }
        if (reservedBooks.length === 2) {
            for (i=0; i<books.length; i++) {
                if (books[i].title === reservedBooks[0].title || books[i].title === reservedBooks[1].title) {
                    books[i].isReserved = true
                }
            }
            response.status(200).json(books)
        }
    }

    sendBook(req, res);
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

// to insert or update a book document by admin
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

// search books by using category and it additionally send details about book already reserved or not
router.get('/category', (req, res, next) => {
    async function sendBooks(request, response) {
        let books = await Book.find({category: request.body.category});
        const user = await User.find({Id: request.body.userId});

        if(user[0].isAdmin) {
            res.status(200).json(books)
        }
        else{
            const reservedBooks = await ReservedBook.find({reservedPerson: request.body.userId});
            if(reservedBooks.length === 0) {
                res.status(200).json(books)
            }
            if(reservedBooks.length === 1) {
                for(i=0; i<books.length; i++) {
                    if (reservedBooks[0].title === books[i].title) {
                        books[i].isReserved = true
                        res.send(200).json(books)
                    }
                }
            }
            if(reservedBooks.length === 2) {
                for(i=0; i<books.length; i++) {
                    if (books[i].title === reservedBooks[0].title || books[i].title === reservedBooks[1].title) {
                        books[i].isReserved = true
                    }
                }
                res.send(200).json(books)
            }
        }
    }

    sendBooks(req, res)
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
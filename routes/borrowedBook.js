var express = require('express');
var router = express.Router();

// models
var BorrowedBook = require('../model/borrowedBook');
var ReservedBook = require('../model/reservedBook');
var Book = require('../model/book');
var History = require('../model/history');

router.use(express.json());

// request by admin
router.post('/borrowed', (req, res, next) => {
    async function borrow(request, response, next) {
        let D = new Date()
        let book = new BorrowedBook()
        book.title = request.body.title
        book.bookID = request.body.bookID
        book.borrower = request.body.userId
        book.borrowedDate = D
        book.returnDate = D.setDate(d.getDate() + 14) // allowed max 14 days

        await book.save((err, data) => {
            if(err) {
                return err
            }
            else {
                await ReservedBook.deleteOne({bookID: request.body.bookID})
                response.status(200).json(book)
            }
        })

        // have to update history later
    }

    borrow(req, res, next);
})

// request by admin
router.post('/returned', (req, res, next) => {
    async function returnBook(request, response, next) {
        await BorrowedBook.deleteOne({bookID: request.body.bookID})
        let book = Book.find({title: request.body.title})
        book[0].availableCopies = book[0].availableCopies + 1
        book[0].bookIDs.push(request.body.bookID)

        await book[0].save((err, data) => {
            if(err) {
                return err
            }
            else {
                response.status(200).json(data)
            }
        })

        // have to update history later
    }

    returnBook(req, res, next);
})

// request by admin
router.get('/allBorrowedBooks', (req, res, next) => {
    BorrowedBook.find({}, (err, data) => {
        if(err) {
            return err
        }
        else {
            res.status(200).json(data)
        }
    })
})

// request by user
router.get('/myBorrowedBooks', (req, res, next) => {
    BorrowedBook.find({borrower: req.body.userId}, (err, data) => {
        if(err) {
            return(err)
        }
        else {
            response.status(200).json(data)
        }
    })
})
var express = require('express');
var router = express.Router();
var BorrowedBook = require('../model/borrowedBook');
var History = require('../model/history');
router.use(express.json());

router.post('/borrow', (req, res, next) => {
    // add new borrowed document
    // delete reservedBook document
    const borrowedBook = new BorrowedBook()
    borrowedBook.title = req.body.title
    borrowedBook.bookID = req.body.bookID
    borrowedBook.borrower = req.body.borrower
    // borrowedBook.borrowedDate = current Date
    // borrowedBook.returnDate = current Date + 14 days

    // update history document
})


// remove reserved document

router.post('/return', (req, res, next) => {
    // update history document
    // delete borrowedBook document
})

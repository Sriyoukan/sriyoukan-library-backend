var express = require('express');
var router = express.Router();

// models
var ReservedBook = require('../model/reservedBook')
var Book = require('../model/book')
var User = require('../model/user')

var bp = require('body-parser')
router.use(express.json())

// to get all reserved books (user request)
router.post('/reservedBook',(req,res,next)=>{
    ReservedBook.find({reservedPerson:req.body.userId}, (err,data)=>{
        if(err){
            return err
        }else{
            res.status(200).json(data)
        }
    })
})

// to get all reserved books (admin request)
router.get('/allReserved',(req,res,next)=>{
    ReservedBook.find((err,data)=>{
        if(err){
            return err
        }else{
            res.status(200).json(data)
        }
    })
})

// user request to reserve a book
router.post('/reserveBook', function(req, res, next) {
    async function reserve(request, response, next) {
        const reservedBooks = await ReservedBook.find({reservedPerson: request.body.userId})
        if(reservedBooks.length < 2) { // can able to reserve book
            var D = new Date()
            let reserveBook = new ReservedBook()
            reserveBook.title = request.body.title
            reserveBook.reservedPerson = request.body.userId
            
            let book = await Book.find({title: request.body.title})
            let bookCopy = book[0].bookIDs.pop()
            book[0].availableCopies = book[0].availableCopies - 1
            await book[0].save((err) => {
                if(err) {
                    return err
                }
            });

            reserveBook.bookID = bookCopy
            reserveBook.reservedDate = D
            reserveBook.lastDateToBorrow = D.setDate(d.getDate() + 7);

            // have to add history document later

            await reserveBook.save((err, data) => {
                if(err) {
                    return err
                }
                else {
                    response.status(200).json(data)
                }
            });
        }
        else { // max number of books reserved - 2
            response.status(200).json([])
        }
    }

    reserve(req, res, next);
})

// user request to relief reserved book
router.post('/unReserveBook', function(req, res, next) {
    async function unReserve(request, response, next) {
        await ReservedBook.deleteOne({bookID: request.body.bookID})
        let book = await Book.find({title: request.body.title})
        book[0].bookIDs.push(request.body.bookID)
        book[0].availableCopies = book[0].availableCopies + 1

        // have to delete history document later

        await book[0].save((err, data) => {
            if(err) {
                return err
            }
            else {
                response.status(200).json(book[0])
            }
        })
    }

    unReserve(req, res, next);
})

router.post('/searchReserved',(req,res,next)=>{
    ReservedBook.find({borrower:req.body.search},(err,data)=>{
        if(err){
            return err
        }else{
            res.status(200).json(data)
        }
    })
})

// have to add functionality for automatically ureserve book when max limit exceeds

module.exports = router;
var express = require('express');
var router = express.Router();
// var bcrypt = require('bcrypt')
// var crypto = require('crypto');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var Book = require('../model/book')
var bp = require('body-parser')
router.use(express.json())

router.get('/book',(req,res,next)=>{
    Book.find({title:req.body.title},(err,data)=>{
        if(err){
            return next(err)
        }else{
            res.status(200).json(data)
        }
    })
})

router.get('/allBook',(req,res,next)=>{
    Book.find((err,data)=>{
        if(err){
            return err
        }else{
            res.status(200).json(data)
        }
    })
})

router.post('/uploadfile', upload.single('file'), (req, res, next) => {
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
    res.send(file)
})

// to add books to the database
router.post('/addbook', (req, res, next) => {
    async function addBook(request, response){
        const docs = await Book.find({title: request.body.title});
    
        if(docs.length === 0) { // new book
            const book = new Book()
            book.title = request.body.title
            book.author = request.body.author
            book.category = request.body.category
            book.availableCopies = Number(request.body.numberOfCopies)
            book.totalCopies = Number(request.body.numberOfCopies)

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
            console.log(typeof(request.body.numberOfCopies))
            docs[0].availableCopies = docs[0].availableCopies + Number(request.body.numberOfCopies);
            docs[0].totalCopies = docs[0].totalCopies + Number(request.body.numberOfCopies);
            
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

router.post('/search',(req,res,next)=>{
    Book.find({title:{ "$regex": req.body.search, "$options": "i" }},(err,data)=>{
        if(err){
            return err
        }else{
            res.status(200).json(data)
        }
    })
})

module.exports = router;

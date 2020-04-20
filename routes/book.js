var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt')
var crypto = require('crypto');
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

router.post('/book', function(req, res, next) {
    var book = new Book()
       
    book.title = req.body.title,
    book.author = req.body.author,
    book.numberOfCopiesAvailable = req.body.numberOfCopiesAvailable
    book.totalCopies = req.body.totalCopies

    book.save((err)=>{
        if(err){
            return err
        }else{
            return res.send(book)
        }

    })
       
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

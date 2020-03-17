var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt')
var crypto = require('crypto');
var ReservedBook = require('../model/reservedBook')
var Book = require('../model/book')
var User = require('../model/user')
var bp = require('body-parser')
router.use(express.json())

router.post('/reservedBook',(req,res,next)=>{
    ReservedBook.find({borrower:req.body.borrower},(err,data)=>{
        if(err){
            return next(err)
        }else{
            res.status(200).json(data)
        }
    })
})


router.post('/reserveBook', function(req, res, next) {
    var reservedBook = new ReservedBook()
    var D = new Date()
    
    //this.number = this.number - 1
    
    reservedBook.title = req.body.title,
    reservedBook.borrower = req.body.borrower,
    reservedBook.returnDate = D.setDate( D.getDate() + 7)
    reservedBook.save((err,data)=>{
        if(err){
            return err
        }else{
            Book.findOne({title:data.title},(err,data)=>{
                if(err){
                    return err
                }else{
                    
                    this.number = data.numberOfCopiesAvailable
                    if(this.number>0){
                    Book.update({title:data.title},{ numberOfCopiesAvailable:this.number-1},{ new: true },(err,data,next)=>{
                        if(err){
                            return err
                        }else{
                            res.status(200).json(data)
                        }
                    })
                    }else{
                        res.send().status(500)
                    }
                    
                }
            })
            
            
        }
       
 })
})
router.post('/returnBook',(req,res,next)=>{
    Book.findOne({title:req.body.title},(err,data)=>{
        if(err){
            return err
        }else{
            a = data.numberOfCopiesAvailable
            if(a<data.totalCopies){
            Book.updateOne({title:req.body.title},{numberOfCopiesAvailable: a+1},{new:true},(err,data,next)=>{
                if(err){
                    return err
                }else{
                    next
                }
                
            })
            ReservedBook.findOneAndDelete({title:req.body.title,borrower:req.body.borrower},(err,data)=>{
                if(err){
                    return err
                }else{
                    res.status(200).json(data)
                }
            })
        }
    }
        
    })
})


module.exports = router;

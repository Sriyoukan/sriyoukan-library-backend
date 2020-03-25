var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt')
var crypto = require('crypto');
var User = require('../model/user')
var Book = require('../model/book')
var ReservedBook = require('../model/reservedBook')
var ReservedRoute = require('../routes/reservedBook')
var bp = require('body-parser')
var notification = false

router.use(express.json())

router.get('/user',(req,res)=>{
        User.findOne({Id:req.body.Id},(err,data)=>{
            if(err){
                return err
            }else{
                res.status(200).json(data)
            }
        })
})
router.post('/user',(req,res,next)=>{
    var user = new User()
    user.name=req.body.name,
    user.age=req.body.age,
    user.Id=req.body.Id,
    user.isAdmin = req.body.isAdmin
    

    user.setPassword(req.body.password)
    user.save((err)=>{
    if (err){
      return next(err);
    }else {
      res.send(user)
        }
    })

})

router.post('/user/login',(req,res,next)=>{
  
    User.findOne({Id : req.body.Id},async (err,data)=>{
      
      if (err){
        return "err";
      }else{
        user = new User(data)
        result =  user.validatePassword(req.body.password,user)
        if(result){
          return res.json(user)
        }else{
          return result
        }
      }
    })
 })

router.get('/notificationStatus',(req,res,next)=>{
   

    var D = new Date()
    ReservedBook.findOne({borrower: req.body.borrower },(err,data)=>{
        if(err){
            res.send(err)
        }else{
            if(data.returnDate< D){
                notification = true
                res.send(notification)
            }
        }
    })

})

router.post('/notification',(req,res,next)=>{
    var D = new Date()
    var overDue = []
    ReservedBook.find({borrower: req.body.borrower},(err,data)=>{
        if(err){
            return err
        }else{
            data.forEach(element => {
                if(element.returnDate < D && element.onHand == true){
                    
                        day = (D.getDate()-element.returnDate.getDate())*10
                        ReservedBook.update({title:element.title,borrower:element.borrower},{penalty:day,overDue:true},{new:true},(err,data)=>{
                            if(err){
                                return err
                            }else{
                                return data
                            }
                        })
                    

                }
            });
            notification = false
            next
        }
    })
    ReservedBook.find({borrower:req.body.borrower,overDue:true},(err,data)=>{
        if(err){
            return err
        }else{
            res.status(200).json(data)
        }
    })
})

router.get('/adminNotification',(req,res,next)=>{
    ReservedBook.find({overDue:true},(err,data)=>{
        if(err){
            return err
        }else{
            res.status(200).json(data)
        }
    })
})
module.exports = router
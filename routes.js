"use strict";

var express = require('express');
var router = express.Router();
var Token = require('./models').Token;
var User = require('./models').User;
var Post = require('./models').Post;
var validator = require('express-validator');
router.use(validator())

router.post('/api/users/register', function(req,res){
  req.checkBody('fname', 'Please enter your first name').notEmpty()
  req.checkBody('lname', 'Please enter your last name').notEmpty()
  req.checkBody('email', 'Please enter your email').notEmpty()
  req.checkBody('password', 'Please enter a password').notEmpty()
  var errors = req.validationErrors();
  if(errors) {
    res.send("There are errors with this play")
  } else {
    var user = new User({
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      password: req.body.password
    })
    user.save(function(error, result) {
      if(error) {
        res.status(500).send("This save messed up on our side")
      } else {
        res.status(200).send("Great Save!")
      }
    })

  }
})
router.post('/api/users/login', function(req,res){

})
router.get('/api/users/logout', function(req,res){

})

module.exports = router;

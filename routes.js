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
  req.checkBody('email', 'Please enter an Email').notEmpty()
  req.checkBody('password', 'Please Enter a Password').notEmpty()
  var errors = req.validationErrors();
  if(errors) {
    res.send("There were errors. Please correct" + errors)
  } else {
    var email = req.body.email
    var password = req.body.password
    User.find({password:password},function(err,resp) {
      if(resp.length) {
        res.status(400).send("Your email was incorrect. Try again, loser")
      } else {
        User.find({email:email}, function(error, result) {
          if(error) {
            res.status(400).send("Your email or password was incorrect. Try again, loser")
          } else {
            var token = new Token({
              userId: result.id,
              token: email + new Date(),
              createdAt: new Date()
            })
            token.save(function(error, result){
              if(error) {
                res.status(500).send('There was an Error saving your data')
              } else {
                res.status(200).send('You have logged in and created a new token!!')
              }
            })
          }
        })
      }
    })
  }
})

router.get('/api/users/logout', function(req,res){
  Token.find({token:req.query.token}, function(error) {
    if(error) {
      res.status(500).send("we could not find your token which is really weird")
    } else {
      res.status(200).send("You have logged out!")
    }
  }).remove().exec()
})

router.get('/api/posts/:page', function(req,res) {

})
router.get('/api/posts', function(req,res) {

})
router.post('/api/posts', function(req,res) {
  var token = req.query.token;
  var content = req.body.content;
  req.checkBody('content', 'Please write something in your post').notEmpty()
  var errors = req.validationErrors();
  if(errors) {
    console.log("Put something in the contnent yo")
  } else {
    Token.find({token:token}, function(error,indivtoken) {
      if (error) {
        res.status(400).send('There was an issue in /api/posts post')
      } else {
        User.find({id: indivtoken.userId}, function(error, newUser) {
          // console.log(newUser)
          if(error) {
            res.status(400).send('There was an issue in finding the ID')
          } else {
            var post = new Post({
              poster: {
                name: newUser[0].fname + ' ' + newUser[0].lname,
                id: newUser.id
              },
              content: content,
              createdAt: new Date(),
              comments: [],
              likes: []
            })
            post.save(function(error,result){
              if(error) {
                res.status(500).send('There was an Error saving your data post')
              } else {
                res.status(200).send('You CREATED A POST!!')
              }
            })
          }
        })
      }
    })
  }
})
router.get('/api/posts/comments/:post_id', function(req,res) {

})
router.post('/api/posts/comments/:post_id', function(req,res) {

})
router.post('/api/posts/comments/:post_id', function(req,res) {

})
router.get('/api/posts/likes/:post_id', function(req,res) {

})

module.exports = router;

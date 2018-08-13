// required modules on the routes
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// router function
const router = express.Router();

// load books model
require('../models/User');
const User = mongoose.model('users')


// route for login
router.get('/login', function (req, res) {
  res.render('users/login')
})

// routes for register
router.get('/register', function (req, res) {
  res.render('users/register')
})

// process registration form
router.post('/register', function (req, res) {
  let errors = [];
  if (req.body.password != req.body.cpassword) {
    errors.push({ text: 'Password does not match' });
  }
  if (req.body.password.length < 4) {
    errors.push({ text: 'Password must be at least 4 characters' })
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      cpassword: req.body.cpassword
    });
  } else {
    // validate if email is existing
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          req.flash('error_msg', 'Email is existing')
          res.redirect('/users/register')
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          });
          // encrypting password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'Registered users')
                  res.redirect('/users/login')
                })
                .catch(err => {
                  console.log(err)
                  return;
                })
            });
          });
        }
      })
  }
});

// passport local strategy
passport.use(new LocalStrategy(
  function (email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});


// Redirects
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true 
}),
  function (req, res) {
    res.redirect('/');
  });

  // logout 
router.get('/logout', function (req, res) {
  req.logout();
  req.flash('success_msg', 'You are logged out');

  res.redirect('/');
})

// export router in the template
module.exports = router;
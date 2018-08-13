// required modules on the routes
const express = require('express');
const mongoose = require('mongoose');

// router function
const router = express.Router();

// load books model
require('../models/Book');
const Book = mongoose.model('books')


// add routes for adding books
router.get('/add', function (req, res) {
  res.render('books/add');
});

// process adding books
router.post('/', function (req, res) {

  let errors = [];
  if (!req.body.title) {
    errors.push({ text: 'Please add a Book title' });
  }
  if (!req.body.details) {
    errors.push({ text: 'Please add some Details' });
  }

  if (errors.length > 0) {
    res.render('books/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    }
    new Book(newUser)
      .save()
      .then(books => {
        req.flash('success_msg', 'Successfully Added Book');
        res.redirect('/books')
      });
  }
});

// fetch books and display in books page
router.get('/', function (req, res) {
  Book.find({})
    .sort({ date: 'desc' })
    .then(books => {
      res.render('books/index', {
        books: books
      });
    });
});

// editing routes for  books
router.get('/edit/:id', function (req, res) {
  Book.findOne({
    _id: req.params.id
  })
    .then(book => {
      res.render('books/edit', {
        book: book
      });
    })
});

// process routes for editing books
router.put('/:id', function (req, res) {
  Book.findOne({
    _id: req.params.id
  })
    .then(book => {
      // new values
      book.title = req.body.title;
      book.details = req.body.details;

      book.save()
        .then(book => {
          req.flash('success_msg', 'Book Updated')
          res.redirect('/books');
        });
    })
});

// delete book item in the collections
router.delete('/:id', function (req, res) {
  Book.remove({
    _id: req.params.id
  })
    .then(() => {
      req.flash('success_msg', 'Book Deleted')
      res.redirect('/books');
    });
});

// export router in the template
module.exports = router;
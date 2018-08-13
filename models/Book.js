// require mongoose module
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define schema
const BookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// model
mongoose.model('books', BookSchema);
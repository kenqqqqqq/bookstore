// create handler for express, mongoose, handlebars, bodyparse module
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// create an instance of the express funtion
const app = express();


// load routes
const books = require('./routes/books');
const users = require('./routes/users');


// Remove the Warning on mongoose
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect('mongodb://localhost/bookstoredb')
  .then(() => console.log('MONGO DB Connected'))
  .catch(err => console.log(err));


// middlewares
// middlewares for express handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// middlewares for body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());

// middleware for public Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// middleware for method-override
app.use(methodOverride('_method'))

// middleware for express session
app.use(session({
  secret: 'set',
  resave: true,
  saveUninitialized: true
}));

// middleware for Passport init
app.use(passport.initialize());
app.use(passport.session());

// middelware for connect flash
app.use(flash());


// Global Variables for flash messages
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// routes
//index route
app.get('/', function (req, res) {
  const title = "Welcome"
  res.render('index', {
    title: title
  });
});

//about route
app.get('/about', function (req, res) {
  res.render('about');
});


// use middleware routes
app.use('/books', books);
app.use('/users', users);


// create user define port for server
const port = 5000;

// user listen() method for setting the server
app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
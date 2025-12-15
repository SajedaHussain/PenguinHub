require('dotenv').config();
require('./config/database.js');

const express = require('express');
const path = require('path');

const app = express();
// Sessions
const session = require('express-session');
const { MongoStore } = require('connect-mongo');

// Middleware
const methodOverride = require('method-override');
const morgan = require('morgan');
const passUserToView = require('./middleware/passUserToView.js');
const isSignedIn = require('./middleware/isSignedIn.js');

// Controllers
const authCtrl = require('./controllers/auth');
const jobCtrl =require('./controllers/jobs.js');
const profileRoutes = require('./controllers/profiles')



// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : '3000';

app.use(express.static(path.join(__dirname, 'public')));
// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride('_method'));
// Morgan for logging HTTP requests
app.use(morgan('dev'));
// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

// Locals
app.use(passUserToView);

// Public routes
app.get('/', (req, res) => {
  res.render('index.ejs')
})

app.use('/auth', authCtrl)

// Protected routes (require login)
app.use(isSignedIn)
app.use('/jobs', jobCtrl)
app.use('/profiles', profileRoutes)


app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
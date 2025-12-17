require('dotenv').config()
require('./config/database.js')

const express = require('express')
const path = require('path')

const app = express()

// Sessions
const session = require('express-session')
const { MongoStore } = require('connect-mongo')

// Middleware
const methodOverride = require('method-override')
const morgan = require('morgan')
const isSignedIn = require('./middleware/isSignedIn.js')

// Models
const Profile = require('./models/profile')

// Controllers
const authCtrl = require('./controllers/auth.js')
const jobCtrl = require('./controllers/jobs.js')
const profileCtrl = require('./controllers/profiles.js')
const gymCtrl = require('./controllers/gym.js')

// Port
const port = process.env.PORT || 3000

// Static files
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static( path.join(__dirname,'Assest')))

// Body parser 
app.use(express.urlencoded({ extended: false }))

// Method override
app.use(methodOverride('_method'))

// Logger
app.use(morgan('dev'))

// Session config
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
)

// ✅ GLOBAL LOCALS (User + Profile for Navbar)
app.use(async (req, res, next) => {
  if (req.session.user) {
    const profile = await Profile.findOne({ owner: req.session.user._id })
    res.locals.user = req.session.user
    res.locals.profile = profile
  } else {
    res.locals.user = null
    res.locals.profile = null
  }
  next()
})

// Public routes
app.get('/', (req, res) => {
  res.render('index.ejs')
})

app.use('/auth', authCtrl)

// Protected routes
app.use(isSignedIn)
app.use('/jobs', jobCtrl)
app.use('/profiles', profileCtrl)
app.use('/gym',gymCtrl)

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`)
})

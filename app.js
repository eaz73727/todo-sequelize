if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const { engine } = require('express-handlebars')
const session = require('express-session')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const usePassport = require('./config/passport')
const routes = require('./routes')

const app = express()
const PORT = process.env.PORT

app.engine('hbs', engine({ extname: 'hbs' }))
app.set('view engine', 'hbs')
app.set('views', './views')

app.use(flash())
app.use(session({
  secret: process.env.secret,
  resave: true,
  saveUninitialized: false
}))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use((req, res, next) => {
  // res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('usccess_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

app.use(routes)

app.listen(PORT, () => {
  console.log(`Server is now opening on http://localhost:${PORT}`)
})
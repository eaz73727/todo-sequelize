const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const user = require('../models/user')

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
  }, (req, email, password, done) => {
    user.findOne({ where: { email } })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'Email or Password is incorrect!' })
        }
        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              return done(null, false, { message: 'Email or Password is incorrect!' })
            }
            return done(null, user)
          })
      })
      .catch(err => console.log(err))
  }))

  passport.serializeUser((user, done) => {
    return done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    user.findByPk(id)
      .then(user => {
        user = user.toJSON()
        return done(null, user)
      })
      .catch(err => console.log(err))
  })
}
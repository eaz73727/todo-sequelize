const express = require('express')
const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User
const router = express.Router()
const passport = require('passport')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureFlash: true,
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name, !email, !password, !confirmPassword) {
    errors.push({ message: '所有欄位都是必填！' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不符' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email
    })
  }
  User.findOne({ where: { email } })
    .then(user => {
      if (user) {
        errors.push({ message: '此信箱已註冊！' })
        return res.render('register', { name, email, errors })
      }
      bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => {
          User.create({
            name,
            email,
            password: hash
          })
        })
        .then(() => {
          req.flash('success_msg', "註冊成功，登入以使用！")
          res.redirect('/')
        })
    })
    .catch(err => console.log(err))
})

router.get('/logout', (req, res, next) => {
  res.logout(err => {
    if (err) {
      return next(err)
    }
    res.redirect('/users/login')
  })
})

module.exports = router
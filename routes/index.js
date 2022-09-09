const express = require('express')
const router = express.Router()
const users = require('./modules/users')
const todos = require('./modules/todos')
const { authenticator } = require('../middleware/auth')

router.use('/users', users)
router.use('/todos', authenticator, todos)
router.get('/', (req, res) => res.redirect('/todos/'))

module.exports = router
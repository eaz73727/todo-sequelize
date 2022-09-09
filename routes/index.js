const express = require('express')
const router = express.Router()
const users = require('./modules/users')
const todos = require('./modules/todos')

router.use('/users', users)
router.use('/todos', todos)
router.get('/', (req, res) => res.redirect('/todos/'))

module.exports = router
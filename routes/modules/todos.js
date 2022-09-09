const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo

router.post('/', (req, res) => {
  const UserId = req.user.id
  const { name } = req.body
  Todo.create({
    name,
    UserId
  })
    .then(() => res.redirect('/todos'))
})

router.get('/:id', (req, res) => {
  Todo.findOne({
    where: {
      UserId: req.user.id,
      id: req.params.id
    },
    raw: true,
    nest: true
  })
    .then(todo => res.render('detail', { todo }))
})

router.get('/new', (req, res) => {
  res.render('new')
})

router.get('/', (req, res) => {
  const UserId = req.user.id
  Todo.findAll({ where: { UserId }, raw: true, nest: true })
    .then(todos => {
      return res.render('index', { todos })
    })
})

module.exports = router
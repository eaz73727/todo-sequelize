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

router.put('/:id', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  const { name, isDone } = req.body
  return Todo.findOne({ where: { id, UserId } })
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => res.redirect(`/todos`))
    .catch(err => console.log(err))
})

router.get('/:id/edit', (req, res) => {
  Todo.findOne({
    raw: true,
    nest: true,
    where: {
      UserId: req.user.id,
      id: req.params.id
    }
  })
    .then(todo => {
      console.log(todo)
      res.render('edit', { todo })
    })
})

router.get('/:id', (req, res) => {
  Todo.findOne({
    raw: true,
    nest: true,
    where: {
      UserId: req.user.id,
      id: req.params.id
    }
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
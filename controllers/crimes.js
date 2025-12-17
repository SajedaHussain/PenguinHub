const express = require('express')
const router = express.Router()
const Crime = require('../models/crime')

// INDEX – Public
router.get('/', async (req, res) => {
  const crimes = await Crime.find()
  res.render('crimes/index.ejs', { crimes })
})

// NEW
router.get('/new', (req, res) => {
  res.render('crimes/new.ejs')
})

// CREATE (Public)
router.post('/', async (req, res) => {
  req.body.owner = req.session.user._id
  await Crime.create(req.body)
  res.redirect('/crimes')
})

// SHOW
router.get('/:id', async (req, res) => {
  const crime = await Crime.findById(req.params.id)
  res.render('crimes/show.ejs', { crime })
})

// EDIT (Public)
router.get('/:id/edit', async (req, res) => {
  const crime = await Crime.findById(req.params.id)
  res.render('crimes/edit.ejs', { crime })
})

// UPDATE (Public)
router.put('/:id', async (req, res) => {
  await Crime.findByIdAndUpdate(req.params.id, req.body)
  res.redirect(`/crimes/${req.params.id}`)
})

// DELETE (Public)
router.delete('/:id', async (req, res) => {
  await Crime.findByIdAndDelete(req.params.id)
  res.redirect('/crimes')
})

module.exports = router

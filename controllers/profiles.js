const express = require('express')
const router = express.Router()
const Profile = require('../models/profile')

// SHOW profile
router.get('/:id', async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id)
    res.render('profiles/show.ejs', { profile })
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})

// EDIT form
router.get('/:id/edit', async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id)

    if (!profile.owner.equals(req.session.user._id)) {
      return res.redirect('/')
    }

    res.render('profiles/edit.ejs', { profile })
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})

// UPDATE profile
router.put('/:id', async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id)

    if (!profile.owner.equals(req.session.user._id)) {
      return res.redirect('/')
    }

    await Profile.findByIdAndUpdate(req.params.id, req.body)
    res.redirect(`/profiles/${profile._id}`)
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})

module.exports = router

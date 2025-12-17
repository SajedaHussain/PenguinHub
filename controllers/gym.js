
const express = require('express')
const router = express.Router()
const Profile = require('../models/profile')

router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne({ owner: req.session.user._id })

    if (!profile) return res.redirect('/profiles/new')

    const height = profile.height / 100 // cm → m
    const weight = profile.weight

    const bmi = (weight / (height * height)).toFixed(1)

    let category = ''
    let planImage = ''

    if (bmi < 18.5) {
      category = 'Underweight Penguin'
      planImage = '/plans/underweight.png'
    } else if (bmi < 25) {
      category = 'Fit Penguin'
      planImage = '/plans/fit.png'
    } else {
      category = 'Heavy Penguin'
      planImage = '/plans/heavy.png'
    }

    res.render('gym/show.ejs', {
      profile,
      bmi,
      category,
      planImage
    })
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})

module.exports = router

const express = require('express')
const router = express.Router()
const Profile = require('../models/profile')

// NEW Profile =======================================================================
router.get('/new', (req, res) => {
  res.render('profiles/new.ejs')
})

// CREATE Profile=====================================================================
router.post('/', async (req, res) => {
  try {
    req.body.owner = req.session.user._id
    const profile = await Profile.create(req.body)
    res.redirect(`/profiles/${profile._id}`)
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})
 
// SHOW profile by USER ID ========================================================== 
router.get('/user/:userId', async (req, res) => {
  try {
    const profile = await Profile.findOne({ owner: req.params.userId })
    if (!profile) {
       return res.redirect('/jobs')
    }

    // صاحب البروفايل
    const isProfileOwner = profile.owner.equals(req.session.user._id)

    // هل المستخدم Owner لوظيفة هذا الشخص مقدم عليها؟
    const Job = require('../models/job')
    const isJobOwner = await Job.exists({
      owner: req.session.user._id,
      'candidates.user': profile.owner
    })

    if (!isProfileOwner && !isJobOwner) {
      return res.redirect('/')
    }

    res.render('profiles/show.ejs', {
      profile,
      user: req.session.user
    })

  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})

// SHOW profile by PROFILE ID ==========================================================
router.get('/:id', async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id)
    if (!profile) return res.redirect('/')
    res.render('profiles/show.ejs', {
      profile,
      user: req.session.user
    })
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})

// EDIT profile ==========================================================
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


// UPDATE profile ================================================================================
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

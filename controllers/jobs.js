// imports =======================================================================================
const express = require('express')
const router = express.Router()
const Job = require('../models/job')


// GET ============================================================================================

router.get('/', async (req, res) => {
    try {
        const populatedJobs = await Job.find().populate('owner')
        res.render('jobs/index.ejs', { jobs: populatedJobs })
    }
    catch (err) {
        console.error('Ran into an error: ' + err)
        console.log('REDIRECTING')
        res.redirect('/')
    }
})

//new job form
router.get('/new', async (req, res) => {
    res.render('jobs/new.ejs')
})

router.get('/:id', async (req, res) => {
    try {
        const populatedJobs = await Job.findById(req.params.id).populate('owner').populate('candidates.user')
        res.render('jobs/show.ejs', { job: populatedJobs, user: req.session.user })
    } catch (err) {
        console.error('Ran into an error: ' + err)
        console.log('REDIRECTING')
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
        if (!job.owner.equals(req.session.user._id)) {
            return res.redirect('/')
        }
        res.render('jobs/edit.ejs', { job })
    }
    catch (err) {
        console.error('Ran into an error: ' + err)
        console.log('REDIRECTING')
        res.redirect('/')
    }
})

// POST ===========================================================================================

router.post('/', async (req, res) => {
    try {
        req.body.owner = req.session.user._id
        const job = await Job.create(req.body)
        res.redirect('/jobs')
    }
    catch (err) {
        console.error('Ran into an error: ' + err)
        console.log('REDIRECTING')
        res.redirect('/')
    }
})
//appling for Job ===============================================================================================
router.post('/:id/apply', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (job.owner.equals(req.session.user._id)) {
      return res.redirect(`/jobs/${job._id}`)
    }

    if (job.candidates.length >= job.maximumApplicants) {
      return res.redirect(`/jobs/${job._id}`)
    }

    const alreadyApplied = job.candidates.some(c =>
      c.user.equals(req.session.user._id)
    )

    if (alreadyApplied) {
      return res.redirect(`/jobs/${job._id}`)
    }

    job.candidates.push({
      user: req.session.user._id
    })

    await job.save()
    res.redirect(`/jobs/${job._id}`)

  } catch (err) {
    console.error(err)
    res.redirect('/jobs')
  }
})


// DELETE ========================================================================================

router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job.owner.equals(req.session.user._id)) {
      return res.redirect('/')
    }

    await job.deleteOne()
    res.redirect('/jobs')
  } catch (err) {
    console.error(err)
    res.redirect('/')
  }
})

// UPDATE (PUT) ==================================================================================
router.put('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job.owner.equals(req.session.user._id)) {
      return res.redirect('/')
    }

    await Job.findByIdAndUpdate(req.params.id, req.body)
    res.redirect(`/jobs/${req.params.id}`)
  } catch (err) {
    console.error(err)
    res.redirect('/')
  }
})

// Select candidate (only one allowed)
router.put('/:jobId/select/:userId', async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId)

    if (!job.owner.equals(req.session.user._id)) {
      return res.redirect('/')
    }

    job.candidates.forEach(candidate => {
      if (candidate.user.equals(req.params.userId)) {
        candidate.status = 'selected'
    //   } else if (candidate.status === 'selected') {
    //     candidate.status = 'pending'
      }
    })

    await job.save()
    res.redirect(`/jobs/${job._id}`)
  } catch (err) {
    console.error(err)
    res.redirect('/jobs')
  }
})

// Reject candidate
router.put('/:jobId/reject/:userId', async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId)

    if (!job.owner.equals(req.session.user._id)) {
      return res.redirect('/')
    }

    const candidate = job.candidates.find(c =>
      c.user.equals(req.params.userId)
    )

    if (candidate) {
      candidate.status = 'rejected'
      await job.save()
    }

    res.redirect(`/jobs/${job._id}`)
  } catch (err) {
    console.error(err)
    res.redirect('/jobs')
  }
})

// exports =======================================================================================
module.exports = router;
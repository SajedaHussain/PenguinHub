// imports =======================================================================================
const express = require('express')
const router = express.Router()
const job = require('../models/job')


// GET ============================================================================================

router.get('/', async (req,res)=>{
    try{
        const populatedJobs = await job.find().populate('owner')
        res.render('jobs/index.ejs', {jobs:populatedJobs})
    }
    catch(err){
        console.error('Ran into an error: '+err)
        console.log('REDIRECTING')
        res.redirect('/')
    }
})


router.get('/new', async (req,res)=>{
    res.render('jobs/new.ejs')
})

router.get('/:id',async(req,res)=>{
    try {
        const populatedJobs = await job.findById(req.params.id).populate('owner')
        const userHasFavorited = populatedJobs.favoritedByUsers.some((user)=>user.equals(req.session.user._id))
        res.render('jobs/show.ejs',{job:populatedJobs,userHasFavorited})
    } catch (err) {
        console.error('Ran into an error: '+err)
        console.log('REDIRECTING')
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req,res)=>{
    try {
        const job = await job.findById(req.params.id)
        res.render('jobs/edit.ejs', {job})
    } 
    catch (err) {
        console.error('Ran into an error: '+err)
        console.log('REDIRECTING')
        res.redirect('/')
    }
})

// POST ===========================================================================================

router.post('/', async (req,res)=>{
    try {
        req.body.owner = req.session.user._id
        const job = await job.create(req.body)
        res.redirect('/jobs')
    } 
    catch(err){
        console.error('Ran into an error: '+err)
        console.log('REDIRECTING')
        res.redirect('/')
  }  
})

// DELETE ========================================================================================

router.delete('/:id', async (req,res)=>{
    try {
        const job = await job.findById(req.params.id)

        if (job.owner.equals(req.session.user._id)) {
            await job.deleteOne({_id: req.params.id})
            res.redirect('/jobs')
        }
        else{
            console.error('YOU DONT HAVE PERMISSION TO DELETE THIS LISTING')  
            res.redirect('/')  
        }
    } 
    catch (err) {
        console.error('Ran into an error: '+err)
        console.log('REDIRECTING')
        res.redirect('/')
    }
})


router.delete('/:jobId/favorited-by/:userId', async (req, res) => {
  try {
    await job.findByIdAndUpdate(req.params.jobId, {$pull: { favoritedByUsers: req.params.userId }});
    res.redirect(`/jobs/${req.params.jobId}`);
  } catch (err) {
        console.error('Ran into an error: '+err)
        console.log('REDIRECTING')
        res.redirect('/')
  }
});

// UPDATE (PUT) ==================================================================================

router.put('/:id', async (req,res)=>{
    try {
        const job = await job.findById(req.params.id)
        
        if (job.owner.equals(req.session.user._id)) {
            await job.findByIdAndUpdate(req.params.id, req.body)
            res.redirect(`/jobs/${req.params.id}`)
        }
        else{
            console.error('YOU DONT HAVE PERMISSION TO EDIT THIS LISTING')  
            res.redirect('/')  
        }
    } 
    catch (err) {
        console.error('Ran into an error: '+err)
        console.log('REDIRECTING')
        res.redirect('/')
    }
})

router.post('/:id/favorited-by/:userId', async (req,res)=>{
    try {
        await job.findByIdAndUpdate(req.params.id,{$push:{favoritedByUsers:req.params.userId}})
        res.redirect(`/jobs/${req.params.id}`)
    } 
    catch (err) {
        console.error('Ran into an error: '+err)
        console.log('REDIRECTING')
        res.redirect('/')
    }
})

// exports =======================================================================================
module.exports = router;
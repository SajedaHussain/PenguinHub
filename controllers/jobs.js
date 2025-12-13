// imports =======================================================================================
// PLEASEEEEE HELP MEEEEE!!!!!!!

const express = require('express')
const router = express.Router()
const job = require('../models/job')
module.exports = router;

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
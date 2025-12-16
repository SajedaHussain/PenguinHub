// models

const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
    workLocation: {
    type: String,
    required: true
  },
  workType: {
    type: String,
    enum: ['shifts', 'full-time', 'part-time'],
    required: true
  },
    employeesNeeded: {
    type: Number,
    required: true,
    min: 1
  },
    maximumApplicants: {
    type: Number,
    required: true,
    min: 1
  },
  description: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  candidates: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      status: {
        type: String,
        enum: ['pending', 'selected', 'rejected'],
        default: 'pending'
      }
    }
  ],

},
  {
    timestamps: true
  });


// model creation =================================================================================

const job = mongoose.model("job", jobSchema);

// exports ========================================================================================

module.exports = job
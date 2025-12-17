const mongoose = require('mongoose')

const crimeSchema = new mongoose.Schema({
  penguinName: {
    type: String,
    required: true
  },
  crime: {
    type: String,
    required: true
  },
  dangerLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  punishment: {
    type: String,
    required: true
  },
  image: {
    type: String // image path
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true })

module.exports = mongoose.model('Crime', crimeSchema)

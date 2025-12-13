// models/listing.js

const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  descraption: {
    type: String,
    required: true,
  },
   owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
      favoritedByUsers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
},
{
    timestamps: true
});
//    RequiredNumber:{
//     type: Number,
//     min:0,
//     required: true,
//    },
//   requirements: {
//      type: String,
//     required: true,
//   },


// model creation =================================================================================

const job = mongoose.model("job", jobSchema);

// exports ========================================================================================

module.exports = job
const mongoose = require('mongoose');

const chansonSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
  anneeDeCreation: {
    type: Number,
    required: true,
  },
  artiste: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artiste',
    required: true, // Artiste is required
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album', // Album is optional
  },
  photo: { // New field to store the photo URL or path
    type: String,
    default: '', // Default to an empty string if no photo is uploaded
  },
}, {
    timestamps: true,
    toJSON: { virtuals: false }, // Prevents `id` from being added
    toObject: { virtuals: false } // For plain objects as well
  });


// Export the model
module.exports = mongoose.model('Chanson', chansonSchema);

const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true,
  },
  anneeDeSortie: {
    type: Number,
    required: true,
  },
  artiste: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artiste', // Relation : un album appartient à un artiste
    required: true,
  },
  chansons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chanson', // Relation : un album contient plusieurs chansons
  }],
},{
    timestamps: true,
    toJSON: { virtuals: false }, // Prevents `id` from being added
    toObject: { virtuals: false } // For plain objects as well
  });

module.exports = mongoose.model('Album', albumSchema);
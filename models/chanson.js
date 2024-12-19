const mongoose = require('mongoose');

const chansonSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true, // Supprime les espaces inutiles au début/fin
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
}, {
  timestamps: true, // Ajoute createdAt et updatedAt automatiquement

  artiste: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artiste', // Référence au modèle Artiste
    required: true,
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album', // Référence à l'album
  },
}, {
  timestamps: true, // Ajoute createdAt et updatedAt automatiquement
});

// Exportation du modèle
module.exports = mongoose.model('Chanson', chansonSchema);

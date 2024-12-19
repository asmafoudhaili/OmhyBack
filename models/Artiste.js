const mongoose = require('mongoose');

const artisteSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true, // Génération automatique de l'ID
      },
      nom: {
        type: String,
        required: true,
        trim: true,
      },
      prenom: {
        type: String,
        required: true,
        trim: true,
      },
      age: {
        type: Number,
        required: true,
        min: 0, // Âge minimal
      },
      genre: {
        type: String,
        required: true,
        trim: true,
      },
      anneeDeCreation: {
        type: Number,
        required: true,
      },
      chansons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chanson', // Référence au modèle Chanson
      }],
      albums: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album', // Relation : un artiste peut avoir plusieurs albums
      }],
    }, {
      timestamps: true, // Ajoute les champs createdAt et updatedAt
    });
    
    


module.exports = mongoose.model('Artiste', artisteSchema);

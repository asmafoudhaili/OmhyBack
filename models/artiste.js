const mongoose = require('mongoose');

const artisteSchema = new mongoose.Schema({
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
      dateAnniversaire: { 
        type: Date,
         required: true 
        }, // Birthday
      dateDeJoindre: { 
        type: Date, 
        required: true
        }  ,  // Joining date
      chansons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chanson', // Référence au modèle Chanson
      }],
      albums: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album', // Relation : un artiste peut avoir plusieurs albums
      }],
      photo: [{ // New field to store image URL or file path
        type: String,
        default: '', // Default is an empty string, but you can change this based on your requirements
      }]
    }, {
        timestamps: true,
        toJSON: { virtuals: false }, // Prevents `id` from being added
        toObject: { virtuals: false } // For plain objects as well
      });
    
    


module.exports = mongoose.model('Artiste', artisteSchema);
const mongoose = require('mongoose');

const adminNewsSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  contenu: { type: String, required: true },
  date: { type: Date, default: Date.now },
  image: { type: String }, // URL ou chemin de l'image

});

module.exports = mongoose.model('AdminNews', adminNewsSchema);
const Artiste = require('../models/artiste');
const Album = require('../models/album');
const Chanson = require('../models/chanson');
const multer = require('multer');
const path = require('path');

// Créer une chanson et lier à un artiste et un album
exports.createChanson = async (req, res) => {
  const { nom, type, anneeDeCreation, artisteId, albumId } = req.body;
  let photo = '';

  if (req.file) {
    photo = req.file.path.replace("\\", "/").replace('uploads\\', '/uploads/'); // Adjusting the path for the frontend
  }

  try {
    const artiste = await Artiste.findById(artisteId);
    if (!artiste) {
      return res.status(404).json({ message: 'Artiste non trouvé' });
    }

    let album;
    if (albumId) {
      album = await Album.findById(albumId);
      if (!album) {
        return res.status(404).json({ message: 'Album non trouvé' });
      }
    }

    const chanson = new Chanson({ 
      nom, 
      type, 
      anneeDeCreation, 
      artiste: artisteId, 
      album: albumId || null, 
      photo,
    });

    await chanson.save();

    artiste.chansons.push(chanson._id);
    await artiste.save();

    if (album) {
      album.chansons.push(chanson._id);
      await album.save();
    }

    res.status(201).json({ chanson, artiste, album });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
  
// Récupérer une chanson avec l'artiste associé
exports.getChansonWithArtiste = async (req, res) => {
    try {
      const chanson = await Chanson.findById(req.params.id)
        .populate('artiste', 'nom prenom'); // Inclut l'artiste (nom et prénom)
  
      if (!chanson) {
        return res.status(404).json({ message: 'Chanson non trouvée' });
      }
  
      res.status(200).json(chanson);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
// Récupérer une chanson avec l'artiste et l'album associés
exports.getChansonWithRelations = async (req, res) => {
  try {
    const chanson = await Chanson.findById(req.params.id)
      .populate('artiste', 'nom prenom') // Inclut l'artiste (nom et prénom)
      .populate('album', 'titre anneeDeSortie'); // Inclut l'album (titre et année de sortie)

    if (!chanson) {
      return res.status(404).json({ message: 'Chanson non trouvée' });
    }

    res.status(200).json(chanson);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer toutes les chansons
exports.getAllChansons = async (req, res) => {
  try {
    const chansons = await Chanson.find()
      .populate('artiste', 'nom prenom') // Inclut les informations des artistes
      .populate('album', 'titre anneeDeSortie'); // Inclut les informations des albums

    res.status(200).json(chansons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer une chanson par ID
exports.getChansonById = async (req, res) => {
  try {
    const chanson = await Chanson.findById(req.params.id);
    if (!chanson) {
      return res.status(404).json({ message: 'Chanson non trouvée' });
    }
    res.status(200).json(chanson);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour une chanson

exports.updateChanson = async (req, res) => {
  const { nom, type, anneeDeCreation } = req.body;
  let photo = '';

  // Handle photo update if a file is provided
  if (req.file) {
    photo = req.file.path.replace("\\", "/").replace('uploads\\', '/uploads/');
  }

  try {
    const updateFields = { nom, type, anneeDeCreation };
    if (photo) {
      updateFields.photo = photo; // Only include photo if a new file is uploaded
    }

    const chanson = await Chanson.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true } // Return updated document and validate fields
    );

    if (!chanson) {
      return res.status(404).json({ message: 'Chanson non trouvée' });
    }

    res.status(200).json(chanson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Supprimer une chanson
exports.deleteChanson = async (req, res) => {
  try {
    const chanson = await Chanson.findByIdAndDelete(req.params.id);
    if (!chanson) {
      return res.status(404).json({ message: 'Chanson non trouvée' });
    }

    // Supprime la chanson de l'artiste et de l'album associés
    await Artiste.findByIdAndUpdate(chanson.artiste, { $pull: { chansons: chanson._id } });
    await Album.findByIdAndUpdate(chanson.album, { $pull: { chansons: chanson._id } });

    res.status(200).json({ message: 'Chanson supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
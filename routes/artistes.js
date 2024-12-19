const express = require('express');
const router = express.Router();
const Artiste = require('../models/Artiste'); // Assure-toi que le modèle Artiste existe

// Créer un artiste
router.post('/', async (req, res) => {
  const { nom,prenom,age, genre, anneeDeCreation } = req.body;

  try {
    const artiste = new Artiste({ nom,prenom,age, genre, anneeDeCreation });
    await artiste.save();
    res.status(201).json(artiste);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

exports.getArtisteWithChansons = async (req, res) => {
    try {
      const artiste = await Artiste.findById(req.params.id).populate('chansons');
      if (!artiste) {
        return res.status(404).json({ message: 'Artiste non trouvé' });
      }
  
      res.status(200).json(artiste);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
// Récupérer tous les artistes
router.get('/', async (req, res) => {
  try {
    const artistes = await Artiste.find();
    res.status(200).json(artistes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Récupérer un artiste par ID
router.get('/:id', async (req, res) => {
  try {
    const artiste = await Artiste.findById(req.params.id);
    if (!artiste) {
      return res.status(404).json({ message: 'Artiste non trouvé' });
    }
    res.status(200).json(artiste);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mettre à jour un artiste
router.put('/:id', async (req, res) => {
  try {
    const artiste = await Artiste.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!artiste) {
      return res.status(404).json({ message: 'Artiste non trouvé' });
    }
    res.status(200).json(artiste);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un artiste
router.delete('/:id', async (req, res) => {
  try {
    const artiste = await Artiste.findByIdAndDelete(req.params.id);
    if (!artiste) {
      return res.status(404).json({ message: 'Artiste non trouvé' });
    }
    res.status(200).json({ message: 'Artiste supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

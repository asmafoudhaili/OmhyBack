const express = require('express');
const multer = require('multer');
const AdminNews = require('../models/news');

const router = express.Router();

// Configuration de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Dossier où les images seront enregistrées
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Nom unique pour chaque fichier
  },
});

const upload = multer({ storage });

// CREATE - Ajouter une nouvelle actualité avec image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const newNews = new AdminNews({
      titre: req.body.titre,
      contenu: req.body.contenu,
      image: req.file ? req.file.path : null, // Enregistrer le chemin de l'image
    });
    const savedNews = await newNews.save();
    res.status(201).json(savedNews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// READ - Récupérer toutes les actualités
router.get('/', async (req, res) => {
  try {
    const news = await AdminNews.find();
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ - Récupérer une actualité par ID
router.get('/:id', async (req, res) => {
  try {
    const news = await AdminNews.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'Actualité non trouvée' });
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE - Modifier une actualité avec image
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updatedData = {
      titre: req.body.titre,
      contenu: req.body.contenu,
    };
    if (req.file) updatedData.image = req.file.path; // Mettre à jour l'image si présente

    const updatedNews = await AdminNews.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!updatedNews) return res.status(404).json({ message: 'Actualité non trouvée' });
    res.status(200).json(updatedNews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Supprimer une actualité
router.delete('/:id', async (req, res) => {
  try {
    const deletedNews = await AdminNews.findByIdAndDelete(req.params.id);
    if (!deletedNews) return res.status(404).json({ message: 'Actualité non trouvée' });
    res.status(200).json({ message: 'Actualité supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

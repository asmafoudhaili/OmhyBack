const express = require('express');
const ArtisteController = require('../controllers/artisteController');
const router = express.Router();
const multer = require('multer');
const upload = require('../utils/multer'); // Make sure this file exists and is properly set up

// Route to create an artiste with image upload
router.post('/', upload.single('photo'), ArtisteController.createArtiste);

// Route to get all artistes
router.get('/', ArtisteController.getAllArtistes);

// Route to get an artiste by ID
router.get('/:id', ArtisteController.getArtisteById);

// Route to get an artiste with their chansons
router.get('/:id/chansons', ArtisteController.getArtisteWithChansons);

// Route to update an artiste with image upload
router.put('/:id', upload.single('photo'), ArtisteController.updateArtiste);

// Route to delete an artiste
router.delete('/:id', ArtisteController.deleteArtiste);

module.exports = router;

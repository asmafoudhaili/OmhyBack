const express = require('express');
const router = express.Router();
const chansonController = require('../controllers/chansonController');
const multer = require('multer');
const upload = require('../utils/multer');
// Route : Créer une chanson
router.post('/', upload.single('photo'), chansonController.createChanson);

// Route : Récupérer toutes les chansons
router.get('/', chansonController.getAllChansons);

// Route : Récupérer une chanson par ID
router.get('/:id', chansonController.getChansonById);

// Route : Récupérer une chanson avec son artiste
router.get('/:id/with-artiste', chansonController.getChansonWithArtiste);

// Route : Mettre à jour une chanson
router.put('/:id', upload.single('photo'), chansonController.updateChanson);

// Route : Supprimer une chanson
router.delete('/:id', chansonController.deleteChanson);

module.exports = router;
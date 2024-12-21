const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');

// Récupérer un album avec ses chansons
router.get('/:id/with-chansons', albumController.getAlbumWithChansons);
// Créer un album
router.post('/', albumController.createAlbum);

// Récupérer tous les albums
router.get('/', albumController.getAllAlbums);

// Récupérer un album par ID
router.get('/:id', albumController.getAlbumById);

// Mettre à jour un album
router.put('/:id', albumController.updateAlbum);

// Supprimer un album
router.delete('/:id', albumController.deleteAlbum);

module.exports = router;
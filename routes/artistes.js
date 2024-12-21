const express = require('express');
const ArtisteController = require('../controllers/artisteController'); 
const router = express.Router();

router.post('/', ArtisteController.createArtiste);
router.get('/', ArtisteController.getAllArtistes);
router.get('/:id', ArtisteController.getArtisteById);
router.get('/:id/chansons', ArtisteController.getArtisteWithChansons);
router.put('/:id', ArtisteController.updateArtiste);
router.delete('/:id', ArtisteController.deleteArtiste);

module.exports = router;

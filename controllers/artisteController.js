const Artiste = require('../models/artiste');
const multer = require('multer');
const path = require('path');

// Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../uploads/'); // Directory to store uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Store the file with a unique name
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/; // Allowed file types
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'), false);
  }
});

class ArtisteController {
  // Create an artiste with image upload
  static async createArtiste(req, res) {
    const { nom, prenom, age, genre, dateAnniversaire, dateDeJoindre } = req.body;
    let photo = '';

    if (req.file) {
      photo = req.file.path.replace("\\", "/").replace('uploads\\', '/uploads/'); // Adjusting the path for the frontend
    }
    

    try {
      const artiste = new Artiste({ nom, prenom, age, genre, dateAnniversaire, dateDeJoindre, photo });
      await artiste.save();
      res.status(201).json(artiste);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Get all artistes
  static async getAllArtistes(req, res) {
    try {
      const artistes = await Artiste.find();
      res.status(200).json(artistes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Get an artiste by ID
  static async getArtisteById(req, res) {
    try {
      const artiste = await Artiste.findById(req.params.id);
      if (!artiste) {
        return res.status(404).json({ message: 'Artiste non trouvé' });
      }
      res.status(200).json(artiste);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Get an artiste with their chansons
  static async getArtisteWithChansons(req, res) {
    try {
      const artiste = await Artiste.findById(req.params.id).populate('chansons');
      if (!artiste) {
        return res.status(404).json({ message: 'Artiste non trouvé' });
      }
      res.status(200).json(artiste);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Update an artiste, including the image
  static async updateArtiste(req, res) {
    const { nom, prenom, age, genre, dateAnniversaire, dateDeJoindre } = req.body;
    let photo = req.body.photo;

    if (req.file) {
      photo = req.file.path.replace("\\", "/").replace('uploads\\', '/uploads/'); // Adjusting the path for the frontend
    }
    

    try {
      const artiste = await Artiste.findByIdAndUpdate(req.params.id, { nom, prenom, age, genre, dateAnniversaire, dateDeJoindre, photo }, { new: true });
      if (!artiste) {
        return res.status(404).json({ message: 'Artiste non trouvé' });
      }
      res.status(200).json(artiste);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Delete an artiste
  static async deleteArtiste(req, res) {
    try {
      const artiste = await Artiste.findByIdAndDelete(req.params.id);
      if (!artiste) {
        return res.status(404).json({ message: 'Artiste non trouvé' });
      }
      res.status(200).json({ message: 'Artiste supprimé' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = ArtisteController;

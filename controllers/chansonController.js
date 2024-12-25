const Artiste = require('../models/artiste');
const Album = require('../models/album');
const multer = require('multer');

const Chanson = require('../models/chanson');


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

// Créer une chanson et lier à un artiste et un album
exports.createChanson = async (req, res) => {
    const { nom, type, anneeDeCreation, artisteId, albumId } = req.body;
    let photo = '';
    if (req.file) {
      photo = req.file.path.replace("\\", "/").replace('uploads\\', '/uploads/'); // Adjusting the path for the frontend
    }
    try {
      // Verify if the artiste exists
      
      artiste = await Artiste.findById(artisteId);
      if (!artiste) {
        return res.status(404).json({ message: 'Artiste non trouvé' });
      
    }
      let album;
      if (albumId) {
        // Verify if the album exists if provided
        album = await Album.findById(albumId);
        if (!album) {
          return res.status(404).json({ message: 'Album non trouvé' });
        }
      }
  
      // Create the chanson
      const chanson = new Chanson({ 
        nom, 
        type, 
        anneeDeCreation, 
        artiste: artisteId, 
        album: albumId || null, 
        photo
      });
      await chanson.save();
  
      // Add the chanson to the artiste
      artiste.chansons.push(chanson._id);
      await artiste.save();
  
      // Add the chanson to the album if provided
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

  try {
    const chanson = await Chanson.findByIdAndUpdate(
      req.params.id,
      { nom, type, anneeDeCreation },
      { new: true, runValidators: true } // Retourne la nouvelle version + validation
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
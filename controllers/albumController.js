const Album = require('../models/album');
const Artiste = require('../models/Artiste');
exports.getAlbumWithChansons = async (req, res) => {
    try {
      const album = await Album.findById(req.params.id)
        .populate('artiste') // Inclure les informations de l'artiste
        .populate('chansons'); // Inclure les informations des chansons
      if (!album) {
        return res.status(404).json({ message: 'Album non trouvé' });
      }
  
      res.status(200).json(album);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
// Créer un album et lier à un artiste
exports.createAlbum = async (req, res) => {
  const { titre, anneeDeSortie, artisteId } = req.body;

  try {
    const artiste = await Artiste.findById(artisteId);
    if (!artiste) {
      return res.status(404).json({ message: 'Artiste non trouvé' });
    }

    // Créer l'album
    const album = new Album({ titre, anneeDeSortie, artiste: artisteId });
    await album.save();

    // Ajouter l'album à l'artiste
    artiste.albums.push(album._id);
    await artiste.save();

    res.status(201).json(album);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Récupérer tous les albums
exports.getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.find().populate('artiste').populate('chansons');
    res.status(200).json(albums);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer un album par ID
exports.getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id).populate('artiste').populate('chansons');
    if (!album) {
      return res.status(404).json({ message: 'Album non trouvé' });
    }
    res.status(200).json(album);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour un album
exports.updateAlbum = async (req, res) => {
  const { titre, anneeDeSortie } = req.body;

  try {
    const album = await Album.findByIdAndUpdate(
      req.params.id,
      { titre, anneeDeSortie },
      { new: true, runValidators: true }
    );
    if (!album) {
      return res.status(404).json({ message: 'Album non trouvé' });
    }
    res.status(200).json(album);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Supprimer un album
exports.deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findByIdAndDelete(req.params.id);
    if (!album) {
      return res.status(404).json({ message: 'Album non trouvé' });
    }
    res.status(200).json({ message: 'Album supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

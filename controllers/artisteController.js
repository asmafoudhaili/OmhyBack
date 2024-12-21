const Artiste = require('../models/artiste'); // Make sure this model exists

class ArtisteController {
  // Create an artiste
  static async createArtiste(req, res) {
    const { nom, prenom, age, genre,  dateAnniversaire, dateDeJoindre } = req.body;

    try {
      const artiste = new Artiste({ nom, prenom, age, genre,  dateAnniversaire, dateDeJoindre });
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

  // Update an artiste
  static async updateArtiste(req, res) {
    try {
      const artiste = await Artiste.findByIdAndUpdate(req.params.id, req.body, { new: true });
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

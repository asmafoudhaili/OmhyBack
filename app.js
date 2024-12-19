const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Routes des albums
// Import des routes
const authRoutes = require('./routes/auth');
const artistRoutes = require('./routes/artistes');
const adminRoutes = require('./routes/admin'); // Nouvelle route admin
const chansonRoutes = require('./routes/chansons'); // Vérifie que le chemin est correct
const albumRoutes = require('./routes/albums');


dotenv.config();
const app = express();

// Middleware
app.use(express.json()); 

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/admin', adminRoutes); // Ajouter cette ligne
app.use('/api/chansons', chansonRoutes);
app.use('/api/albums', albumRoutes);


// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.log(err));

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur en fonctionnement sur le port ${PORT}`);
});

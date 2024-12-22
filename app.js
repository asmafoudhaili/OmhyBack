const dotenv = require('dotenv');
dotenv.config(); // Load .env variables

console.log(process.env); // Print all environment variables
console.log(process.env.JWT_SECRET); // Specifically check if JWT_SECRET is loaded

const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const artistRoutes = require('./routes/artistes');
const adminRoutes = require('./routes/admin'); // Nouvelle route admin
const chansonRoutes = require('./routes/chansons'); // Vérifie que le chemin est correct
const albumRoutes = require('./routes/albums');

const cors = require('cors');

const app = express();
const path = require('path');  // Import the 'path' module

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log(process.env.JWT_SECRET);  // This should print the JWT_SECRET value

app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  credentials: true
}));

// Middleware
app.use(express.json()); // For parsing application/json

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/artistes', artistRoutes);
app.use('/api/admin', adminRoutes); // Ajouter cette ligne
app.use('/api/chansons', chansonRoutes);
app.use('/api/albums', albumRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

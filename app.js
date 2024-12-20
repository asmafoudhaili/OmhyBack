const dotenv = require('dotenv');
dotenv.config(); // Load .env variables

console.log(process.env); // Print all environment variables
console.log(process.env.JWT_SECRET); // Specifically check if JWT_SECRET is loaded

const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const cors = require('cors');

const app = express();

console.log(process.env.JWT_SECRET);  // This should print the JWT_SECRET value

app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  credentials: true
}));

// Middleware
app.use(express.json()); // For parsing application/json

// Routes
app.use('/api/auth', authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Admin = require('../models/admin');
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('JWT_SECRET is not defined in the environment variables!');
  process.exit(1); // Exit the application if the secret is not defined
}

// Admin Registration Controller
const registerAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if the admin already exists
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create a new Admin
    admin = new Admin({ email, password });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);

    // Save the admin to the database
    await admin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin Login Controller
const loginAdmin = async (req, res) => {
  console.log('Request received at /loginAdmin'); // Confirm request reaches endpoint
  const { email, password } = req.body;
  console.log('Request body:', req.body); // Log the structure of req.body

  try {
    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log(`Admin with email ${email} not found`); // Log invalid email
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      console.log(`Invalid password for email ${email}`); // Log invalid password
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '1h' });
    console.log(`JWT generated for admin with ID ${admin._id}`); // Log successful JWT generation

    res.json({ token, admin: { email: admin.email, id: admin._id } });
  } catch (error) {
    console.error('Login error:', error); // Log server error
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { registerAdmin, loginAdmin };

const express = require('express');
const { check, validationResult } = require('express-validator');
const authController = require('../controllers/authController');
const router = express.Router();

// Admin Registration
router.post('/register', [
  check('email', 'Please provide a valid email').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
], authController.registerAdmin);

// Admin Login
router.post('/login', [
  check('email', 'Please provide a valid email').isEmail(),
  check('password', 'Password is required').exists(),
], authController.loginAdmin);

module.exports = router;

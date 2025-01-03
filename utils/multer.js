const multer = require('multer');
const path = require('path');

// Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.body.type === 'artist' ? './uploads/artists/' : './uploads/chansons/';
    cb(null, folder); // Save based on the type (artist or chanson)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
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

// Export the upload object
module.exports = upload;

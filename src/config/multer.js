const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { fileFilter } = require('../middlewares/fileFilter');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, res, next) => {
    next(null, uploadDir);
  },
  filename: (req, res, next) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(res.originalname);
    next(null, res.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 10, // Maximum 10 files per request
  },
  fileFilter: fileFilter,
});

module.exports = {
  upload
}; 
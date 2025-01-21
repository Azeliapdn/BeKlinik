require('dotenv').config(); // Load .env variables

const multer = require('multer');

// Read database dialect from environment variable
const dbDialect = process.env.DB_DIALECT;

// Determine file size limit based on the database dialect
const file_size_limit = dbDialect === 'postgres' ? 16 * 1024 * 1024 : 8 * 1024 * 1024;

// Configure storage
const storage = multer.memoryStorage();

// Common image file filter
const file_filter_image = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimeTypes.includes(file.mimetype) || allowedMimeTypes.includes(file.type)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Only image files are allowed!'), false); // Reject the file
    }
};

// Configure multer for image uploads
const upload_image = multer({
    storage,
    limits: {
        fileSize: file_size_limit, // Use the dynamic file size limit
    },
    fileFilter: file_filter_image,
});

module.exports = {
    upload_image,
};

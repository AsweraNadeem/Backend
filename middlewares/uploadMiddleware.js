const multer = require("multer");
const path = require("path");

// CHANGE: Switch to memoryStorage for Vercel compatibility
const storage = multer.memoryStorage(); 

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);
    if (extName && mimeType) {
        cb(null, true);
    } else {
        cb(new Error("Only .jpeg, .jpg, .png images are allowed"));
    }
};

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter
});

module.exports = upload;

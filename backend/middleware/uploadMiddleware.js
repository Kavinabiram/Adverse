const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedVideoTypes = /mp4|mov|webm/;
    const allowedImageTypes = /jpeg|jpg|png/;
    
    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    if (file.fieldname === 'video') {
        if (allowedVideoTypes.test(extname) && allowedVideoTypes.test(mimetype)) {
            return cb(null, true);
        }
        return cb(new Error('Only mp4, mov, and webm video formats are allowed!'));
    }

    if (file.fieldname === 'thumbnail' || file.fieldname === 'media') {
        if (allowedImageTypes.test(extname) && allowedImageTypes.test(mimetype)) {
            return cb(null, true);
        }
        return cb(new Error('Only jpeg, jpg, and png image formats are allowed!'));
    }

    cb(null, true); // Fallback
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB limit
    fileFilter: fileFilter
});

module.exports = { upload };

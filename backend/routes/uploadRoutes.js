import path from 'path';
import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: (req, file) => ({
        folder: 'funiro-products',
        public_id: `${file.fieldname}-${Date.now()}`,
        format: path.extname(file.originalname).replace('.', '') || 'jpg',
    }),
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Images only!'));
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

router.post('/', protect, admin, (req, res) => {
    upload.single('image')(req, res, function (err) {
        if (err) {
            return res.status(400).send({ message: err.message || err });
        }
        try {
            if (!req.file) {
                return res.status(400).send({ message: 'No valid image file provided' });
            }
            res.status(200).send({
                message: 'Image uploaded',
                image: req.file.path, // Cloudinary returns a full URL
            });
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    });
});

export default router;

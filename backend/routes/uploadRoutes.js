import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
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
    checkFileType: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

router.post('/', (req, res) => {
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
                image: `/${req.file.path.replace(/\\/g, '/')}`, // Normalize path for frontend
            });
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    });
});

export default router;

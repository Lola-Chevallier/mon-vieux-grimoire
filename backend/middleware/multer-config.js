const multer = require('multer');

const MIME_TYPE = {
    'image.jpg': 'jpg',
    'image.jpeg': 'jpg',
    'image.png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join(_);
        const etension = MIME_TYPE[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }), single('image');
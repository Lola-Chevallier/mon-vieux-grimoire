const multer = require('multer');

// On stocke l'image directement en mémoire (pas sur le disque)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite de 5 Mo
  },
  fileFilter: (req, file, callback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error('Type de fichier non autorisé (JPEG, PNG, WEBP uniquement).'));
    }
  }
});

module.exports = upload.single('image');
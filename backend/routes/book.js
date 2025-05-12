const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Route ajout livre
router.post('/', auth, multer, bookCtrl.createBook);

// Route modification livre
router.put('/:id',auth, multer, bookCtrl.modifyBook);

// Route suppression livre
router.delete('/:id',auth, bookCtrl.deleteBook);

// Route affichage livre unique
router.get('/:id',auth, bookCtrl.getOneBook);

// Route affichages livres
router.get('/', auth, bookCtrl.getAllBooks);

// Route pour ajouter une note à un livre
router.post('/:id/rating', auth, bookCtrl.rateBook);

module.exports = router;
const router = express.Router();
const express = require('express');
const bookCtrl = require('../controllers/book');
const auth = require('auth');

// Ajout conseillé par chat gpt car error 404 sans ça
router.get('/', (req, res, next) => {
    res.status(200).json({ message: 'Bienvenue sur l\'API' });
    next();
});

// Route ajout livre
router.post('/', auth, bookCtrl.createBook);

// Route modification livre
router.put('/:id',auth, bookCtrl.modifyBook);

// Route suppression livre
router.delete('/:id',auth, bookCtrl.deleteBook);

// Route affichage livre unique
router.get('/:id',auth, bookCtrl.getOneBook);

// Route affichages livres
router.get('/',auth, bookCtrl.getAllBooks);

module.exports = router;
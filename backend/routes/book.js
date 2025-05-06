const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book');

// Ajout conseillé par chat gpt car error 404 sans ça
router.get('/', (req, res, next) => {
    res.status(200).json({ message: 'Bienvenue sur l\'API' });
    next();
});

// Route ajout livre
router.post('/', bookCtrl.createBook);

// Route modification livre
router.put('/:id', bookCtrl.modifyBook);

// Route suppression livre
router.delete('/:id', bookCtrl.deleteBook);

// Route affichage livre unique
router.get('/:id', bookCtrl.getOneBook);

// Route affichages livres
router.get('/', bookCtrl.getAllBooks);

module.exports = router;
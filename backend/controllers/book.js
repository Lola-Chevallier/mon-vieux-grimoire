const Book = require('../models/Book');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

exports.createBook = async (req, res, next) => {
    try {
        const bookObject = JSON.parse(req.body.book);
        delete bookObject.id;
        delete bookObject.userId;
    
        // Génère un nom optimisé pour l'image
        const filename = `${Date.now()}-${req.file.originalname.split(' ').join('_')}.webp`;
       
        // Traite l’image avec sharp (compression + redimensionnement)
        await sharp(req.file.buffer)
            .resize({ width: 800 }) // redimensionne à max 800px de large
            .webp({ quality: 80 })  // convertit en WebP avec qualité 80%
            .toFile(`images/${filename}`).catch(error => console.log(error));
           
        const book = new Book({
            ...bookObject,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${filename}`
        });
        

        await book.save()
        
        res.status(201).json({ message: 'Livre enregistré !' });
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.modifyBook = async (req, res, next) => {
    try {
      const bookObject = req.file ? JSON.parse(req.body.book) : req.body;
      delete bookObject.userId;
  
      const book = await Book.findOne({ _id: req.params.id });
      if (!book) return res.status(404).json({ message: 'Livre non trouvé' });
  
      if (book.userId !== req.auth.userId) {
        return res.status(401).json({ message: 'Non autorisé' });
      }
  
      let updatedFields = { ...bookObject };
  
      if (req.file) {
        // Supprimer l'ancienne image
        const oldFilename = book.imageUrl.split('/images/')[1];
        const oldFilePath = path.join(__dirname, '../images', oldFilename);
        fs.unlink(oldFilePath, err => {
          if (err) console.error('Erreur lors de la suppression de l’ancienne image :', err);
        });
  
        // Générer un nouveau nom de fichier
        const newFilename = `${Date.now()}-${req.file.originalname.split(' ').join('_')}.webp`;
        const outputPath = path.join(__dirname, '../images', newFilename);
  
        // Traiter et enregistrer l'image
        await sharp(req.file.buffer)
          .resize({ width: 800 })
          .webp({ quality: 80 })
          .toFile(outputPath);
  
        // Mettre à jour l'URL de l’image
        updatedFields.imageUrl = `${req.protocol}://${req.get('host')}/images/${newFilename}`;
      }
  
      await Book.updateOne({ _id: req.params.id }, { ...updatedFields, _id: req.params.id });
      res.status(200).json({ message: 'Livre modifié !' });
  
    } catch (error) {
      console.error(error);
      res.status(400).json({ error });
    }
  };

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non autorisé !'})
            } else {
                // Récupère le nom du fichier à partir de l'URL de l'image
                const filename = book.imageUrl.split('/images/')[1];

                //construit le chemin absolu du fichier image
                const filePath = path.join(__dirname, '../images', filename);
                //Supprime l'image dans le dossier images
                fs.unlink(filePath, (err) => {
                    if (err && err.code !== 'ENOENT') {
                        //Si erreur autre que "fichier non trouvé", on log mais on continue
                        console.error('Erreur lors de la suppression de l\image:', err);
                    }

                    //Quoi qu'il arrive, on supprime le livre de la base 
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Livre supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};

exports.rateBook = async (req, res) => {
    try {
      const bookId = req.params.id;
      const userId = req.auth.userId; // récupéré grâce au middleware d'authentification
      const { rating } = req.body;
  
      // Vérification de la validité de la note
      if (typeof rating !== 'number' || rating < 0 || rating > 5) {
        return res.status(400).json({ message: 'La note doit être un nombre entre 0 et 5.' });
      }
  
      const book = await Book.findById(bookId);
      if (!book) return res.status(404).json({ message: 'Livre non trouvé.' });
  
      // Vérification que l'utilisateur n'a pas déjà noté ce livre
      if (book.ratings.some(r => r.userId === userId)) {
        return res.status(400).json({ message: 'Vous avez déjà noté ce livre.' });
      }
  
      // Ajout de la nouvelle note
      book.ratings.push({ userId, grade: rating });
  
      // Calcul de la nouvelle moyenne
      const total = book.ratings.reduce((sum, r) => sum + r.grade, 0);
      book.averageRating = Number((total / book.ratings.length).toFixed(2));
  
      await book.save();
  
      res.status(201).json(book);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
  
exports.bestRatingBook = (req, res, next) => {
    Book.find()
        .sort({ "averageRating": -1 })
        .limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};
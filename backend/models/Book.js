const mongoose = require('mongoose');

// Schéma principal pour les notes

const ratingSchema = mongoose.Schema({
    userId: { type: String, required: true },
    grade: { type: Number, required: true }
});


// Schéma principal pour les livres

const bookSchema = mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: { type: [ratingSchema], required: true },
    averageRating: { type: Number, required: true }
});

module.exports = mongoose.model('Book', bookSchema);
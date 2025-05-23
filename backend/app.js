const express = require('express');
const app = express();
const mongoose = require('mongoose');

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://lolachevallier:8O93kpAJp3Cbjonu@cluster0.4oizoh5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API Livres !');
});

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

// servir les images statiques
const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'images')));
console.log('Dossier statique images exposé:', path.join(__dirname, 'images'));

module.exports = app;

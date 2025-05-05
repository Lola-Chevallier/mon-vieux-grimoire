const express = require('express');
const app = express();
const mongoose = require('mongoose');

const Book = require('./models/Book');

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

app.post('/api/books', (req, res, next) => {
    delete req.body._id;
    const book = new Book({
     ...req.body   
    });
    book.save()
        .then(() => res.satus(201).json({ message: 'Livre enregistré !' }))
        .catch(error => res.status(400).json({ error }));
    next();
});

// Ajout conseillé par chat gpt car error 404 sans ça
app.get('/', (req, res, next) => {
    res.status(200).json({ message: 'Bienvenue sur l\'API' });
    next();
});

// Route modification livre
app.put('/api/books/:id', (req, res) => {
    Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Livre modifié !'}))
        .catch(error => res.status(400).json({ error }));
})

// Route suppression livre
app.delete('/api/books/:id', (req, res) => {
    Book.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Livre supprimé!'}))
        .catch(error => res.status(400).json({ error }));

})

// Route affichage livre unique
app.get('/api/books/:id', (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
});

// Route affichages livres
app.get('/api/books', (req, res) => {
    Book.find()
        .then( books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
});

module.exports = app;

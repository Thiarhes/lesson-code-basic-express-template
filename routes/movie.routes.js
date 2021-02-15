const express = require('express');
const router = express.Router();
const fileUploader = require('../configs/cloudinary.config');
const Movie = require('../models/Movie.model');

router.get('/movies', (req, res) => {
    Movie.find()
        .then(moviesFromDB => {
            console.log(moviesFromDB);
            res.render('movies-list', { movies: moviesFromDB });
        })
        .catch(err => console.log(`Error while getting the movies from the DB:  ${err}`));
});

router.get('/movies/create', (req, res) => {
    res.render('movie-create');
});

router.post('/movies/create', fileUploader.single('image'), (req, res) => {
    const { title, description } = req.body;

    Movie.create({ title, description, imgUrl: req.file.path })
        .then(() => res.redirect('/movies'))
        .catch(err => console.log(`Error while creating a new movie: ${err}`));
});

router.get('/movies/:id/edit', (req, res) => {
    const { id } = req.params;
    Movie.findById(id)
        .then(movieToEdit => res.render('movie-edit', movieToEdit))
        .catch(err => console.log(`Error while getting a single movie to edit: ${err}`));
});

router.post('/movies/:id/edit', fileUploader.single('image'), (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    let imageUrl;
    if (req.file) {
        imageUrl = req.file.path;
    } else {
        imageUrl = req.body.existingImage;
    }

    Movie.findByIdAndUpdate(id, { title, description, imageUrl }, { new: true })
        .then(() => res.redirect('/movies'))
        .catch(err => console.log(`Error while updating a single movie: ${err}`));
});

module.exports = router;
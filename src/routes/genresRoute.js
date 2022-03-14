const express = require('express');
const { createGenre, findAllGenres, findGenreByPk, updateGenre, deleteGenre } = require('../controllers/genresController');

const genresRouter = express.Router();

genresRouter.post('/', createGenre);
genresRouter.get('/', findAllGenres);
genresRouter.get('/:id', findGenreByPk);
genresRouter.patch('/:id', updateGenre);
genresRouter.delete('/:id', deleteGenre);

module.exports = genresRouter;
const { createItem, getAllItems, getItemByPk, updateItem, deleteItem } = require('./helpers');

const createGenre = (req, res) => createItem(res, 'genre', req.body);

const findAllGenres = (_, res) => getAllItems(res, 'genre');

const findGenreByPk = (req, res) => getItemByPk(res, 'genre', req.params.id);

const updateGenre = (req, res) => updateItem(res, 'genre', req.body, req.params.id);

const deleteGenre = (req, res) => deleteItem(res, 'genre', req.params.id);


module.exports = { createGenre, findAllGenres, findGenreByPk, updateGenre, deleteGenre };
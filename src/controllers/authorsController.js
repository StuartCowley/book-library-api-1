const { createItem, getAllItems, getItemByPk, updateItem, deleteItem } = require('../controllers/helpers');

const createAuthor = (req, res) => createItem(res, 'author', req.body);

const findAllAuthors = (_, res) => getAllItems(res, 'author');

const findAuthorByPk = (req, res) => getItemByPk(res, 'author', req.params.id);

const updateAuthor = (req, res) => updateItem(res, 'author', req.body, req.params.id);

const deleteAuthor = (req, res) => deleteItem(res, 'author', req.params.id);


module.exports = { createAuthor, findAllAuthors, findAuthorByPk, updateAuthor, deleteAuthor };
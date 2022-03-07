const { createItem, getAllItems, getItemByPk, updateItem, deleteItem } = require('./helpers');

const createBook = (req, res) => createItem(res, 'book', req.body);

const findAllBooks = (_, res) => getAllItems(res, 'book');

const findBookByPk = (req, res) => getItemByPk(res, 'book', req.params.id);

const updateBook = (req, res) => updateItem(res, 'book', req.body, req.params.id);

const deleteBook = (req, res) => deleteItem(res, 'book', req.params.id);

module.exports = { createBook, findAllBooks, findBookByPk, updateBook, deleteBook };
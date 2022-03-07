const express = require('express');
const { createBook, findAllBooks, findBookByPk, updateBook, deleteBook } = require('../controllers/booksController');

const booksRouter = express.Router();

booksRouter.post('/', createBook);
booksRouter.get('/', findAllBooks);
booksRouter.get('/:id', findBookByPk);
booksRouter.patch('/:id', updateBook);
booksRouter.delete('/:id', deleteBook);


module.exports = booksRouter;
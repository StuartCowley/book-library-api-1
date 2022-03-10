const express = require('express');
const { createAuthor, findAllAuthors, findAuthorByPk, updateAuthor, deleteAuthor } = require('../controllers/authorsController');

const authorsRouter = express.Router();

authorsRouter.post('/', createAuthor);
authorsRouter.get('/', findAllAuthors);
authorsRouter.get('/:id', findAuthorByPk);
authorsRouter.patch('/:id', updateAuthor);
authorsRouter.delete('/:id', deleteAuthor);

module.exports = authorsRouter;
const express = require('express');
const { createReader, findAllReaders, findReaderByPk, updateReader, deleteReader } = require('../controllers/readersController');

const readersRouter = express.Router();

readersRouter.post('/', createReader);
readersRouter.get('/', findAllReaders);
readersRouter.get('/:id', findReaderByPk);
readersRouter.patch('/:id', updateReader);
readersRouter.delete('/:id', deleteReader);

module.exports = readersRouter;
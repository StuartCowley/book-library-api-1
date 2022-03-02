const express = require('express');
const { createReader, findAllReaders, findReaderByPk, updateReader, deleteReader } = require('../controllers/readersController');

const readersRouter = express.Router();

readersRouter.post('/', createReader);
readersRouter.get('/', findAllReaders);
readersRouter.get('/:readerId', findReaderByPk);
readersRouter.patch('/:readerId', updateReader);
readersRouter.delete('/:readerId', deleteReader);

module.exports = readersRouter;
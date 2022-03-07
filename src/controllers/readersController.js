const { createItem, getAllItems, getItemByPk, updateItem, deleteItem } = require('./helpers');

const createReader = (req, res) => createItem(res, 'reader', req.body);

const findAllReaders = (_, res) => getAllItems(res, 'reader');

const findReaderByPk = (req, res) => getItemByPk(res, 'reader', req.params.id);

const updateReader = (req, res) => updateItem(res, 'reader', req.body, req.params.id);

const deleteReader = (req, res) => deleteItem(res, 'reader', req.params.id);


module.exports = { createReader, findAllReaders, findReaderByPk, updateReader, deleteReader };
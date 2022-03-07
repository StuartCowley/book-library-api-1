const express = require('express');
const readersRouter = require('./routes/readersRoute');
const booksRouter = require('./routes/booksRoute');

const app = express();

app.use(express.json());

app.use('/readers', readersRouter); 
app.use('/books', booksRouter);

module.exports = app;
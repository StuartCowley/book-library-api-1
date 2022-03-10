const express = require('express');
const readersRouter = require('./routes/readersRoute');
const booksRouter = require('./routes/booksRoute');
const authorsRouter = require('./routes/authorsRoute');
const genresRouter = require('./routes/genresRoute');

const app = express();

app.use(express.json());

app.use('/readers', readersRouter); 
app.use('/books', booksRouter);
app.use('/authors', authorsRouter);
app.use('/genres', genresRouter);

module.exports = app;
const { Book, Author, Genre } = require('../src/models');

const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');

describe('/books', () => {
    let testGenre;
    let testAuthor;

    before(async() => Book.sequelize.sync());

    describe('with no records in the database', () => {

        beforeEach(async() => {
            await Book.destroy({ where: {} });
            await Genre.destroy({ where: {} });
            await Author.destroy({ where: {} });
            testAuthor = await Author.create({ author: 'David Xiang' });
            testGenre = await Genre.create({ genre: 'Computer' });
        });

        describe('POST/books', () => {
            it('creates a new book in the database', async() => {
                const response = await request(app).post('/books').send({
                    title: 'Software Developer Life',
                    authorId: testAuthor.id,
                    genreId: testGenre.id,
                    ISBN: '978-1-7323459-0-4'
                });

                const newBookRecord = await Book.findByPk(response.body.id, { raw: true });

                expect(response.status).to.equal(201);
                //expect(response.body.title).to.equal('Software Developer Life');
                //expect(newBookRecord.title).to.equal('Software Developer Life');
                //expect(newBookRecord.ISBN).to.equal('978-1-7323459-0-4');
            });

            it('cannot create a book if title or author is missing', async() => {
                const response = await request(app).post('/books').send({});

                const newBookRecord = await Book.findByPk(response.body.id, {
                    raw: true,
                });
          
                expect(response.status).to.equal(400);
                expect(response.body).hasOwnProperty('errors');
                expect(newBookRecord).to.equal(null);
            });
        });
    });

    describe('with records in the database', () => {
        let books;

        beforeEach(async() => {
            await Book.destroy({ where: {} });

            const testAuthorOne = Author.create({
                author: 'David Xiang'
            });
    
            const testAuthorTwo = Author.create({
                author: 'Marijin Haverbeke'
            });
    
            const testAuthorThree = Author.create({
                author: 'Andrzej Sapkowski'
            }); 

            const testGenreOne = Genre.create({
                genre: 'Computer'
            });
    
            const testGenreTwo = Genre.create({
                genre: 'Programming'
            });
    
            const testGenreThree = Genre.create({
                genre: 'Fantasy'
            });

            books = await Promise.all([
                Book.create({
                    title: 'Software Developer Life',
                    author: testAuthorOne.id,
                    genre: testGenreOne.id,
                    ISBN: '978-1-7323459-0-4'
                }),
                Book.create({
                    title: 'Eloquent JavaScript',
                    author: testAuthorTwo.id,
                    genre: testGenreTwo.id,
                    ISBN: '978-1-59327-282-1'
                }),
                Book.create({
                    title: 'The Witcher - The Last Wish',
                    author: testAuthorThree.id,
                    genre: testGenreThree.id,
                    ISBN: '978-1-473-23106-1'
                })
            ]);
        });

        describe('GET/books', () => {
            it('gets all books records', async() => {
                const response = await request(app).get('/books');

                expect(response.status).to.equal(200);
                expect(response.body.length).to.equal(3);

                response.body.forEach((book) => {
                    const expected = books.find((a) => a.dataValues.id === book.id);

                    expect(book.title).to.equal(expected.title);
                });
            });
        });

        describe('GET/books/:bookId', () => {
            it('gets books record by id', async() => {
                const book = books[0];
                const response = await request(app).get(`/books/${book.id}`);

                expect(response.status).to.equal(200);
                expect(response.body.title).to.equal(book.title);
                expect(response.body.author).to.equal(book.author);
            });

            it('returns a 404 if the book does not exist', async() => {
                const response = await request(app).get('/books/12345');

                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal('The book could not be found.');
            });
        });

        describe('PATCH/books/:bookId', () => {
            it('updates book ISBN by id', async() => {
                const book = books[0];

                // console.log(`the reader is ${reader}, and the reader id is ${reader.id}`);
                // console.log(`my readers are ${readers}`);

                const response = await request(app)
                    .patch(`/books/${book.id}`)
                    .send({ ISBN: '978-1-473-23106-1B' });
                const updatedBookRecord = await Book.findByPk(book.id, {
                    raw: true,
                });

                expect(response.status).to.equal(200);
                expect(updatedBookRecord.ISBN).to.equal('978-1-473-23106-1B');
            });

            it('returns a 404 if the reader does not exist', async() => {
                const response = await request(app)
                    .patch('/books/12345')
                    .send({ ISBN: '978-1-473-23106-1C' });

                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal('The book could not be found.');
            });
        });

        describe('DELETE/books/:bookId', () => {
            it('deletes reader record by id', async() => {
                const book = books[0];
                const response = await request(app).delete(`/books/${book.id}`);
                const deletedBook = await Book.findByPk(book.id, { raw: true });
                console.log(`this is the response for deleting book ${response}`);
                expect(response.status).to.equal(204);
                expect(deletedBook).to.equal(null);
            });

            it('returns a 404 if the reader does not exist', async() => {
                const response = await request(app).delete('/books/12345');
                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal('The book could not be found.');
            });
        });
    })
})
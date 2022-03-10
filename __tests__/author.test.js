const { Author } = require('../src/models');
const app = require('../src/app');

const { expect } = require('chai');
const request = require('supertest');

describe('/authors', () => {
    before(async() => Author.sequelize.sync()); 
    beforeEach(async() => {
        await Author.destroy({ where: {} }); 
    });

    describe('with no records in the database', () => {
        describe('POST/authors', () => {
            it('creates a new author in the database', async() => {
                const response = await request(app).post('/authors').send({
                    author: 'J.K. Rowling'
                });
                const newAuthor = await Author.findByPk(response.body.id, { raw: true });

                expect(response.status).to.equal(201);
                expect(response.body.author).to.equal('J.K. Rowling');
                expect(newAuthor.author).to.equal('J.K. Rowling');
            });

            it('throws an error if author is null', async() => {
                const response = await request(app).post('/authors').send({
                    author: null
                });
                const newAuthor = await Author.findByPk(response.body.id, { raw: true });

                expect(response.status).to.equal(400);
                expect(response.body).to.haveOwnProperty('errors');
                expect(newAuthor).to.equal(null);
            });

            it('throws an error if author is an empty string', async() => {
                const response = await request(app).post('/authors').send({
                    author: ''
                });
                const newAuthor = await Author.findByPk(response.body.id, { raw: true });

                expect(response.status).to.equal(400);
                expect(response.body).to.haveOwnProperty('errors');
                expect(newAuthor).to.equal(null);
            });
        });
    });

    describe('with records in the database', () => {
        let authors;

        beforeEach(async() => {

            await Author.destroy({ where: {} });
            
            authors = await Promise.all([
                Author.create({
                    author: 'J.K. Rowling'
                }),
                Author.create({
                    author: 'J.R.R. Tolkien'
                }),
                Author.create({
                    author: 'Frank Herbert'
                })
            ]);
        });

        describe('POST/authors', () => {
            it('throws an error if the author is already exists', async() => {
                const duplicatedAuthor = authors[0].author;
                const response = await request(app).post('/authors').send(duplicatedAuthor);
                
                expect(response.status).to.equal(400);
            });
        });

        describe('GET/authors', () => {
            it('gets all authors record', async() => {
                const response = await request(app).get('/authors');

                expect(response.status).to.equal(200);
                expect(response.body.length).to.equal(3);

                response.body.forEach(author => {
                    const expected = authors.find(a => a.id === author.id);

                    expect(author.author).to.equal(expected.author);
                });
            });
        });

        describe('GET/authors/:authorId', () => {
            it('gets reader record by id', async() => {
                const author = authors[0];
                const response = await request(app).get(`/authors/${author.id}`);

                expect(response.status).to.equal(200);
                expect(response.body.author).to.equal(author.author);
            });

            it('returns a 404 if the author does not exist', async() => {
                const response = await request(app).get('/authors/12345');

                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal('The author could not be found.');
            });
        });

        describe('PATCH/authors/:authorId', () => {
            it('udpates author by id', async() => {
                const author = authors[0];
                const response = await request(app).patch(`/authors/${author.id}`).send({
                    author: 'Elsa'
                });
                const updatedAuthor = await Author.findByPk(author.id, { raw: true });

                expect(response.status).to.equal(200);
                expect(updatedAuthor.author).to.equal('Elsa');
            });

            it('returns a 404 if the author does not exist', async() => {
                const response = await request(app).patch('/authors/12345');

                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal('The author could not be found.');
            });
        });

        describe('DELETE/authors/:authorId', () => {
            it('deletes author record by id', async() => {
                const author = authors[0];
                const response = await request(app).delete(`/authors/${author.id}`);
                const deletedAuthor = await Author.findByPk(author.id, { raw: true });

                expect(response.status).to.equal(204);
                expect(deletedAuthor).to.equal(null);
            });

            it('returns a 404 if the author does not exist', async() => {
                const response = await request(app).delete('/authors/12345');
                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal('The author could not be found.');
            });
        });
    });
});
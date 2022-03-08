const { Genre } = require('../src/models');
const app = require('../src/app');

const { expect } = require('chai');
const request = require('supertest');

describe('/genres', () => {
    before(async() => Genre.sequelize.sync()); 
    beforeEach(async() => {
        await Genre.destroy({ where: {} }); 
    });

    describe('with no records in the database', () => {
        describe('POST/genres', () => {
            it('creates a new genre in the database', async() => {
                const response = await request(app).post('/genres').send({
                    genre: 'Sci-Fi'
                });
                const newGenre = await Genre.findByPk(response.body.id, { raw: true });

                expect(response.status).to.equal(201);
                expect(response.body.genre).to.equal('Sci-Fi');
                expect(newGenre.genre).to.equal('Sci-Fi');
            });

            it('throws an error if genre is null', () => {
                const response = await request(app).post('/genres').send({
                    genre: null
                });
                const newGenre = await Genre.findByPk(response.body.id, { raw: true });

                expect(response.status).to.equal(400);
                expect(response.body).to.haveOwnProperty('errors');
                expect(newGenre).to.equal(null);
            });

            it('throws an error if genre is an empty string', () => {
                const response = await request(app).post('/genres').send({
                    genre: ''
                });
                const newGenre = await Genre.findByPk(response.body.id, { raw: true });

                expect(response.status).to.equal(400);
                expect(response.body).to.haveOwnProperty('errors');
                expect(newGenre).to.equal(null);
            });
        });
    });

    describe('with records in the database', () => {
        let genres;

        beforeEach(async() => {
            genres = await Promise.all([
                Genre.create({
                    genre: 'Sci-Fi'
                }),
                Genre.create({
                    genre: 'Fantasy'
                }),
                Genre.create({
                    genre: 'Mystery'
                })
            ]);
        });

        describe('POST/genres', () => {
            it('throws an error if the genre is already exists', () => {
                const duplicatedGenre = genres[0].genre;
                const response = await request(app).post('/genres').send(duplicatedGenre);
                
                expect(response.status).to.equal(400);
            });
        });

        describe('GET/genres', () => {
            it('gets all genres record', async() => {
                const response = await request(app).get('/genres');

                expect(response.status).to.equal(200);
                expect(response.body.length).to.equal(3);

                response.body.forEach(genre => {
                    const expected = genres.find(a => a.id === genre.id);

                    expect(genre.genre).to.equal(expected.genre);
                });
            });
        });

        describe('GET/genres/:genreId', () => {
            it('gets genre record by id', async() => {
                const genre = genres[0];
                const response = await request(app).get(`/genres/${genre.id}`);

                expect(response.status).to.equal(200);
                expect(response.body.genre).to.equal(genre.genre);
            });

            it('returns a 404 if the genre does not exist', async() => {
                const response = await request(app).get('/genre/12345');

                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal('The genre could not be found.');
            });
        });

        describe('PATCH/genres/:genreId', () => {
            it('udpates genre by id', async() => {
                const genre = genres[0];
                const response = await request(app).patch(`/genres/${genre.id}`).send({
                    genre: 'Thriller'
                });
                const updatedGenre = await Genre.findByPk(genre.id, { raw: true });

                expect(response.status).to.equal(200);
                expect(updatedGenre.genre).to.equal('Thriller');
            });

            it('returns a 404 if the genre does not exist', async() => {
                const response = await request(app).patch('/genre/12345');

                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal('The genre could not be found.');
            });
        });

        describe('DELETE/genres/:genreId', () => {
            it('deletes genre record by id', async() => {
                const genre = genres[0];
                const response = await request(app).delete(`/genres/${genre.id}`);
                const deletedGenre = await Genre.findByPk(genre.id, { raw: true });

                expect(response.status).to.equal(204);
                expect(deletedGenre).to.equal(null);
            });

            it('returns a 404 if the genre does not exist', async() => {
                const response = await request(app).delete('/genres/12345');
                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal('The genre could not be found.');
            });
        });
    });
});
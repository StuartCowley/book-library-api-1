// In Sequelize, all of our models will be exported from src/models/index.js
const { Reader } = require('../src/models');
const app = require('../src/app');

const { expect } = require('chai');
const request = require('supertest');

describe('/readers', () => {
    // for setting up and tear down
    before(async() => Reader.sequelize.sync()); // used to connect to the Reader table, same as beforeAll() in Jest,
    // to clean out the Reader table, so we don't get any interference from previous tests
    beforeEach(async() => {
        await Reader.destroy({ where: {} }); // all of interactions with the database are through methods we call on the model object
    });
    // request - supertest: HTTP assertions library 
    // expect - chai: assertions library
    describe('with no records in the database', () => {
        describe('POST/readers', () => {
            it('creates a new reader in the database', async() => {
                const response = await request(app).post('/readers').send({
                    name: 'Elizabeth Bennet',
                    email: 'future_ms_darcy@gmail.com',
                    password: 'helloworld'
                });
                // using the { expect } function from the Chai library
                const newReaderRecord = await Reader.findByPk(response.body.id, { raw: true });
                
                expect(response.status).to.equal(201);
                expect(response.body.name).to.equal('Elizabeth Bennet');
                expect(newReaderRecord.name).to.equal('Elizabeth Bennet');
                expect(newReaderRecord.email).to.equal('future_ms_darcy@gmail.com');
                expect(newReaderRecord.password).to.equal('helloworld');
            });

            it('throws an error if any of the fields is null', async () => {
                const response = await request(app).post('/readers').send({});
                const newReaderRecord = await Reader.findByPk(response.body.id, {
                  raw: true,
                });
        
                expect(response.status).to.equal(400);
                expect(response.body.errors.length).to.equal(3);
                expect(newReaderRecord).to.equal(null);
            });

            it('throws an if email or password in wrong format', async () => {
                
                const response = await request(app).post('/readers').send({
                    name: 'Micky Mouse',
                    email: 'mickymousegmail.com',
                    password: 'abc'
                });

                const newReaderRecord = await Reader.findByPk(response.body.id, { raw: true });
        
                expect(response.status).to.equal(400);
                expect(response.body.errors.length).to.equal(2);
                expect(newReaderRecord).to.equal(null);
            });
          
            it('throws an error if name is an empty string', async () => {
                const response = await request(app).post('/readers').send({
                    name: '',
                    email: 'mickymouse@gmail.com',
                    password: 'abcdefghi'
                });
                
                const newReaderRecord = await Reader.findByPk(response.body.id);
        
                expect(response.status).to.equal(400);
                expect(response.body).to.haveOwnProperty('errors');
                expect(newReaderRecord).to.equal(null);
            });
        
            it('errors if email is empty string', async () => {
                const response = await request(app).post('/readers').send({
                    name: 'Micky Mouse',
                    email: '',
                    password: 'abcdefghi'
                });
                
                const newReaderRecord = await Reader.findByPk(response.body.id);
        
                expect(response.status).to.equal(400);
                expect(response.body).to.haveOwnProperty('errors');
                expect(newReaderRecord).to.equal(null);
            });
        });
    });

    describe('with records in the database', () => {
        let readers;

        beforeEach(async() => {
            readers = await Promise.all([
                Reader.create({
                    name: 'Elizabeth Bennet',
                    email: 'future_ms_darcy@gmail.com',
                    password: 'helloworld'
                }),
                Reader.create({ name: 'Arya Stark', email: 'vmorgul@me.com', password: 'goodbyeworld' }),
                Reader.create({ name: 'Lyra Belacqua', email: 'darknorth123@msn.org', password: 'helloagain' })
            ]);
        });

        describe('GET/readers', () => {
            it('gets all readers records', async() => {
                const response = await request(app).get('/readers');

                expect(response.status).to.equal(200);
                expect(response.body.length).to.equal(3);

                response.body.forEach((reader) => {
                    const expected = readers.find((a) => a.id === reader.id);

                    expect(reader.name).to.equal(expected.name);
                    expect(reader.email).to.equal(expected.email);
                    expect(reader.password).to.equal(undefined);
                });
            });
        });

        describe('GET/readers/:readerId', () => {
            it('gets readers record by id', async() => {
                const reader = readers[0];
                const response = await request(app).get(`/readers/${reader.id}`);

                expect(response.status).to.equal(200);
                expect(response.body.name).to.equal(reader.name);
                expect(response.body.email).to.equal(reader.email);
                expect(response.body.password).to.equal(undefined);
            });

            it('returns a 404 if the reader does not exist', async() => {
                const response = await request(app).get('/readers/12345');

                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal('The reader could not be found.');
            });
        });

        describe('PATCH/readers/:readerId', () => {
            it('updates readers email by id', async() => {
                const reader = readers[0];

                //console.log(`the reader is ${reader}, and the reader id is ${reader.id}`);
                //console.log(`my readers are ${readers}`);

                const response = await request(app)
                    .patch(`/readers/${reader.id}`)
                    .send({ email: 'miss_e_bennet@gmail.com' });
                const updatedReaderRecord = await Reader.findByPk(reader.id, {
                    raw: true,
                });

                expect(response.status).to.equal(200);
                expect(updatedReaderRecord.email).to.equal('miss_e_bennet@gmail.com');
            });

            it('returns a 404 if the reader does not exist', async() => {
                const response = await request(app)
                    .patch('/readers/12345')
                    .send({ email: 'some_new_email@gmail.com' });

                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal('The reader could not be found.');
            });
        });

        describe('DELETE/readers/:readerId', () => {
            it('deletes reader record by id', async() => {
                const reader = readers[0];
                const response = await request(app).delete(`/readers/${reader.id}`);
                const deletedReader = await Reader.findByPk(reader.id, { raw: true });
                console.log(`this is the response for deleting reader ${response}`);
                expect(response.status).to.equal(204);
                expect(deletedReader).to.equal(null);
            });

            it('returns a 404 if the reader does not exist', async() => {
                const response = await request(app).delete('/readers/12345');
                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal('The reader could not be found.');
            });
        });
    });
});
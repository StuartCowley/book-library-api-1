// In Sequelize, all of our models will be exported from src/models/index.js

const Sequelize = require('sequelize');
const ReaderModel = require('./reader');

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const setUpDatabase = () => {

    const connection = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
        host: DB_HOST,
        port: DB_PORT,
        dialect: 'mysql',
        logging: false
    });

    const Reader = ReaderModel(connection, Sequelize);

    // this gives sequelize permission to alter our tables to fit the models that we are going to create. 
    connection.sync({ alter: true });

    return { Reader };

};

module.exports = setUpDatabase();
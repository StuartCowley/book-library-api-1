const { Reader } = require('../models');

/*
const createReader = async(req, res) => {
    const newReader = await Reader.create(req.body);
    res.status(201).json(newReader);
};
*/

const createReader = async(req, res) => {

    const { name, email } = req.body;
    try{
        const createdReader = await Reader.create({
            name,
            email
        });
        return res.status(201).send(createdReader);
    }catch(err){
        return res.status(500).json(err)
    }
};

const findAllReaders = async(_, res) => {
        const foundReaders = await Reader.findAll();
        return res.json(foundReaders);
};

const findReaderByPk = async(req, res) => {

    try{
        const readerId = req.params.readerId;
        const foundReader = await Reader.findByPk(readerId);

        if(!foundReader){
            return res.status(404).json({ error: 'The reader could not be found.'});
        }else{
            return res.json(foundReader);
        }
    }catch(err){
        console.log(err);
        return res.status(500).send(err);
    };
};

const updateReader = async (req, res) => {
    
    try{
        const readerId = req.params.readerId;
        const updateData = req.body;

        console.log(`the id is ${readerId}`); 

        const [ updatedRows ] = await Reader.update(updateData, { where : {id: readerId } });

        console.log(updatedRows);

        if (!updatedRows) {
            res.status(404).json({ error: 'The reader could not be found.'});
        } else {
            res.status(200).send();
        };
    }catch(err){
        
        return res.status(500).send(err);
    };
    
};

const deleteReader = async(req, res) => {

    try{
        const readerId = req.params.readerId;
        const deleteReader = await Reader.destroy({ where: {id: readerId} });

        if(!deleteReader){
            
            return res.status(404).json({error: 'The reader could not be found.'});
        }else{
            
            return res.sendStatus(204);
        };
    }catch(err){
        
        return res.status(500).json(err);
    };
};


module.exports = { createReader, findAllReaders, findReaderByPk, updateReader, deleteReader };
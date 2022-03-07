const { Reader, Book } = require('../models');

const getModel = model => {
    const models = {
        reader: Reader,
        book: Book
    };
    return models[model];
};

const get404Error = model => ({error: `The ${model} could not be found.`});

const removePassword = object => {
    if(object.hasOwnProperty('password')){
        delete object.password;
    };
    return object;
};

const createItem = async(res, model, obj) => {
    const Model = getModel(model);

    try{
        const newItem = await Model.create(obj); // req.body
        const itemWithoutPassword = removePassword(newItem.dataValues);
        return res.status(201).json(itemWithoutPassword);
    }catch(err){
        const errorMessage = err.errors.map((e) => e.message);
        return res.status(400).json({ errors: errorMessage });
    };
};

const getAllItems = async(res, model) => {
    const Model = getModel(model);

    const allItems = await Model.findAll();

    const itemsWithoutPassword = allItems.map(item => removePassword(item.dataValues));
    return res.json(itemsWithoutPassword);
};

const getItemByPk = async(res, model, id) => {
    const Model = getModel(model);
    
    const foundItem = await Model.findByPk(id); // req.params.id
    if(!foundItem){
        return res.status(404).json(get404Error(model));
    }else{
        const itemWithoutPassword = removePassword(foundItem.dataValues);
        return res.status(200).json(itemWithoutPassword);
    };
};

const updateItem = async(res, model, obj, id) => {

    const Model = getModel(model);

    try{

        const [ updatedRows ] = await Model.update(obj, { where: {id} });
        
        if(!updatedRows){
            res.status(404).json(get404Error(model));
        }else{
            const updatedItem = await Model.findByPk(id);
            const itemWithoutPassword = removePassword(updatedItem.dataValues);
            res.status(200).json(itemWithoutPassword);
        };
    }catch(err){
        return res.status(500).send(err);
    };
};

const deleteItem = async(res, model, id) => {
    const Model = getModel(model);

    try{
        const deleteItem = await Model.destroy({ where: {id} });

        if(!deleteItem){
            return res.status(404).json(get404Error(model));
        }else{
            return res.sendStatus(204);
        };
    }catch(err){
        return res.status(500).json(err);
    };
};

module.exports = { createItem, getAllItems, getItemByPk, updateItem, deleteItem };
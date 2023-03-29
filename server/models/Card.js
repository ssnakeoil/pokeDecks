const { hash } = require('bcrypt');
const { Schema, model } = require('mongoose');

const cardSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
    },
    link: {
        type: String,
    },
    rarity:{
        type: String,
        required: true,

    },
    images: {  
        type: Object,    
        required: true,
    },
    tcgplayer:{
        type: Object,
        required: true,
    }

});

const Card= model('Card', cardSchema); 
module.exports = cardSchema;

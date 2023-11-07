'use restrict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: [true, 'O nome é obrigatório'],
    },
    number: {
        type: String,
        required: [true, 'O número é obrigatório'],
    },
    city: {
        type: String,
        required: [true, 'O nome da cidade é obrigatório'],
    }
});

module.exports = mongoose.model('UsefulContacts', schema);
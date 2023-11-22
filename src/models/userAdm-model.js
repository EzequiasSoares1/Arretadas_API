'use restrict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
        enum: ['garanhuns', 'monteiro']
    },
    roles: [
        {
            type: String,
            required: [true],
            enum: ['admin'],
            default: 'admin'
        }
    ]
});

module.exports = mongoose.model('UserAdm', schema);
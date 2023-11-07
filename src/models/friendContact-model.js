'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name:{
        type: String,
        required: true
    },
    number: {
        type: String,
        required: [true, 'O número é obrigatório'],
    }
});

module.exports = mongoose.model('FriendContact', schema);
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    code: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    hour: {
        type: String,
        required: true
    },
    emergence_text: {
        type: String,
        required: true,
        default: 'Estou em perigo, por favor entre em contato com as autoridades'
    }
});

module.exports = mongoose.model('Alert', schema);
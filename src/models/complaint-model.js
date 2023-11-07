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
        required: true
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
        required: false
    },
    longitude: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: true,
    },
    hour: {
        type: String,
        required: true
    },
    type_complaint: [{
        type: String,
        required: true,
        enum: ['Sexual', 'Moral', 'Verbal', 'Física', 'Psicológica', 'Patrimonial']
    }]
});

module.exports = mongoose.model('Complaint', schema);
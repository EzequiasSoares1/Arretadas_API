'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const codigoSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    codigo:{
        type: String,
        required: true
    },
    dataUtilizacao: {
        type: String,
    }
});

module.exports = mongoose.model("Codes", codigoSchema);
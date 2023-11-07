'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    status: {
        type: Boolean,
        required: false
    },
})
module.exports = mongoose.model('Bot', schema);
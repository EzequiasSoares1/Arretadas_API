'use strict';
const mongoose = require('mongoose');
const Codes = mongoose.model('Codes');

exports.validate = async (code) => {
   return await Codes.findOne({
        codigo: code
    })
}

exports.update = async (id) => {
    return await Codes.findByIdAndUpdate(id, {
        $set: {
            dataUtilizacao: new Date().toLocaleDateString('pt-BR')
        }
    })
}

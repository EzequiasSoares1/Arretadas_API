'use strict';
const log = require('../services/log-service')
const repository = require('../repositories/protectiveMeasure-repository')

exports.validate = async(request, response) =>{
    const { code } = request.body;
    const result = await repository.validate(code);

    if (result) {
        log("", "Sucess", "protectiveMeasure/validate", "validar código de medida protetiva");
        return response.status(200).send({ message: 'Código encontrado'});
    }
    log("", "Error", "protectiveMeasure/validate", "validar código de medida protetiva");
    return response.status(400).send({ message: 'Código não encontrado ou já utilizado'});
}
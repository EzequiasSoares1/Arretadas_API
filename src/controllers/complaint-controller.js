const ValidaContract = require('../validators/fluent-validator');
const repository = require('../repositories/complaint-repository');
const guid = require('guid');
const moment = require('moment')
const log = require('../services/log-service')
const axios = require('axios');
const treatComplaint = require('../services/treatment-service')
require('dotenv').config()


exports.getById = async (request, response) => {
    try {
        const res = await repository.getById(request.params.id);

        if (res === null) return response.status(404).send({ message: "Denuncia não encontrada" });

        log("", "Sucess", "complaint-controller/getById", "Buscar id");
        return response.status(200).send(res);
    } catch (e) {

        log("", "Error", "complaint-controller/getById", "Buscar id: " + e);
        return response.status(500).send({ message: 'Falha ao processar sua requisição' });
    }

}

exports.getByUser = async (request, response) => {
    try {
        const res = await repository.getByUser(request.params.id);
        if (res === null)  return response.status(404);

        log("", "Sucess", "complaint-controller/getByUser", "Buscar por usuario");
        return response.status(200).send(res);

    } catch (e) {
        log("", "Error", "complaint-controller/getByUser", "Buscar por usuario: "+e);
        return response.status(500).send({ message: 'Falha ao processar sua requisição' });
    }

}

exports.post = async (request, response) => {
    let contract = new ValidaContract();

    if (!contract.isValid()) {
        log("", "Warning", "complaint-controller/post", "validar contrato");
        return response.status(400).send(contract.errors()).end();
    }

    try {
        const { id, latitude, longitude, date, hour, type_complaint } = request.body
    
        if(type_complaint !== null &&
           type_complaint!== undefined &&
           type_complaint.length !== 0
           ){
            let district
            let city
            
            await axios.get(`https://revgeocode.search.hereapi.com/v1/revgeocode?at=${latitude},${longitude}`, {
                params: {
                    apikey: process.env.HERE_APIKEY
                }
            }).then(response => {
                const address = response.data.items[0].address
                district = address.district ? address.district : "Bairro N/D"
                city = address.city ? address.city : "Cidade N/D"
            }).catch((error) => {
                district = "Bairro N/D"
                city = "Cidade N/D"  
                console.log(error);
            })
    
            await repository.create({
                user: id,
                district,
                city: city.toLowerCase(),
                latitude,
                longitude,
                code: guid.raw().substring(0, 6),
                date,
                hour,
                type_complaint
            });

            log("", "Sucess", "complaint-controller/post", "criar denuncia");

            return response.status(201).send({
                message: 'Denuncia criada com sucesso!'
            }); 
        }else{

            log("", "error", "complaint-controller/post", "criar denuncia ");

            return response.status(400).send({
                message: 'Passe ao menos um tipo de denuncia'
            });
        }
    } catch (e) {

        log("", "Error", "complaint-controller/post", "criar denuncia: "+e);
        return response.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
}

exports.delete = async (request, response) => {
    try {
        if (await repository.getById(request.params.id) == null)
         return response.status(404).send({ message: "Denuncia não encontrada" });

        await repository.delete(request.params.id);

        log("", "Sucess", "complaint-controller/delete", "remover denuncia");
        return response.status(200).send({ message: 'denuncia removido com sucesso!' });
    } catch (e) {
        log("", "Error", "complaint-controller/delete", "remover denuncia: "+e);
        return response.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
}

exports.put = async (request, response) => {
    try {
         if (await repository.getById(request.body.id) == null)
             return response.status(404).send({ message: "Denuncia não encontrada" });

        await repository.update(request.body);

        log("", "Sucess", "complaint-controller/put", "atualizar denuncia");
        return response.status(200).send({ message: 'denuncia atualizada com sucesso!' });
    } catch (e) {
        log("", "Error", "complaint-controller/put", "atualizar contato: "+e);
        return response.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
}
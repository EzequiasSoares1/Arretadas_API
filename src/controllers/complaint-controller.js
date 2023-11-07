// 'user strict';

const ValidaContract = require('../validators/fluent-validator');
const repository = require('../repositories/complaint-repository');
const guid = require('guid');
const moment = require('moment')
const log = require('../services/log-service')
const axios = require('axios');
const treatComplaint = require('../services/treatment-service')
require('dotenv').config()

exports.get = async (request, response) => {
    try {
        const { init, final, city } = request.query
        const typeComplaint = request.query.type.split(',');
        const initValid = moment(init).isValid()
        const finalValid = moment(final).isValid()
        const validCitys = ['garanhuns', 'monteiro', 'cidade n/d']
        
        if (!initValid || !finalValid || !city || !validCitys.some(validCity => validCity === city.toLowerCase())) {
            log("", "Warning", "complaint-controller/get", `. Data Inicial: ${init} / Data final: ${final}`);
            return response.status(400).send({ message: "data ou cidade inválida" })
        }
        
        const data = await repository.get({ init, final }, city.toLowerCase())
        const result = await treatComplaint.treatment({data, init, final, typeComplaint});

        log("", "Sucess", "complaint-controller/get", "resgatar dados");
        return response.status(200).send(result)

    } catch (e) {
        log("", "Error", "complaint-controller/get", "resgatar dados");
        return response.status(500).send({ message: 'Falha ao processar sua requisição.' });
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

            log("", "error", "complaint-controller/post", "criar denuncia");

            return response.status(400).send({
                message: 'Passe ao menos um tipo de denuncia'
            });
        }
    } catch (e) {

        log("", "Error", "complaint-controller/post", "criar denuncia");
        return response.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
}

exports.delete = async (request, response) => {
    try {
        await repository.delete(request.body.id);

        log("", "Sucess", "complaint-controller/delete", "remover contato");
        return response.status(200).send({ message: 'Contato removido com sucesso!' });
    } catch (e) {

        log("", "Error", "complaint-controller/delete", "remover contato");
        return response.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
}
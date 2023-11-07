'user strict';
require('dotenv').config();

const ValidaContract = require('../validators/fluent-validator');
const repository = require('../repositories/alert-repository');
const axios = require('axios');
const friendContacts = require('../repositories/friendContact-repository');
const userRepository = require('../repositories/user-repository');
const moment = require('moment')
const log = require('../services/log-service')
const treatAlert = require('../services/treatment-service')
const {PubSub} = require("@google-cloud/pubsub");

const isProduction = process.env.PRODUCTION;

const projectId = process.env.GCLOUD_PROJECT_ID;
const topicName = process.env.GCLOUD_PUBSUB_TOPIC_NAME;

let topic;
async function startPubsub(){
    if(isProduction === "true"){
        const pubsub = new PubSub({projectId});
        topic = await pubsub.topic(topicName);
    }
}
startPubsub();
exports.get = async (request, response, next) => {
    try {
        const { init, final, city } = request.query
        const initValid = moment(init).isValid()
        const finalValid = moment(final).isValid()
        const validCitys = ['garanhuns', 'monteiro', 'cidade n/d']

        if (!initValid || !finalValid || !city || !validCitys.some(validCity => validCity === city.toLowerCase())) {
            log("", "Warning", "alert-controller/get", `Data Inicial: ${init} Data final: ${final}`);
            return response.status(400).send({ message: "data ou cidade inválida" })
        }

        var data = await repository.get({ init, final }, city.toLowerCase());
        let result = await treatAlert.treatment({data, init, final});
        return response.status(200).send(result);
    } catch (e) {
        log("", "Error", "alert-controller/get", "resgatar dados");
        return response.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
}

exports.post = async (request, response) => {
    let contract = new ValidaContract();

    contract.isRequired(request.body.latitude, 'A latitude deve existir');
    contract.isRequired(request.body.longitude, 'A longitude deve existir');

    if (!contract.isValid()) {
        log("", "Info", "alert-controller/post", "validar contrato ");
        return response.status(400).send(contract.errors()).end();
    }
    try {
        const { id, latitude, longitude, date, hour } = request.body
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

        const {protection_code, nickname} = await userRepository.getById(id);
    
        await repository.create({
            user: id,
            district,
            city: city.toLowerCase(),
            latitude,
            date,
            hour,
            longitude,
            code: protection_code
        });

        const userContacts = await friendContacts.getByUser(id);

        const numbers = [];
        userContacts.forEach(user => {
            numbers.push("55"+user.number)
        });
        let data = JSON.stringify({
            message:`_Esta é uma mensagem automática do aplicativo ARRETADAS_\nA usuária ${nickname} está pedindo socorro urgente!\nEncontre-a nesta localização:`,
            coordenadas:{
                latitude,
                longitude,
            },
            numbers
        });
        if(isProduction === "true"){
            console.log("Envio mensagem")
            await topic.publish(Buffer.from(data));
        }

        log("", "Sucess", "alert-controller/post", "criar alerta");
        return response.status(201).send({
            message: 'Alert criado com sucesso!'
        });
    } catch (e) {
        
        log("", "Error", "alert-controller/post", "criar alerta");
        return response.status(500).send({
            message: 'Falha ao processar sua requisição',
            e
        });
    }
}

exports.delete = async (request, response, next) => {
    try {
        await repository.delete(request.body.id);
        log("", "Sucess", "alert-controller/delete", "remover alert");
        return response.status(200).send({ message: 'Alert removido com sucesso!' });
    } catch (e) {
        log("", "Error", "alert-controller/delete", "remover alert");
        return response.status(500).send({ message: 'Falha ao processar sua requisição' });

    }
}
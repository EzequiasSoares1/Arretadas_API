'use strict';
const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/usefulcontacts-repository');
const log = require('../services/log-service')

exports.get = async(request, response) => {
    try{
        const data = await repository.get();
        log("","Sucess","usefulcontacts-controller/get","resgatar dados");

        return response.status(200).send(data);
    }catch(e) {
        log("","Error","usefulcontacts-controller/get","resgatar dados");

        return response.status(500).send({ message: 'Falha ao processar sua requisição'});
    }
}

exports.getByName = async(request, response) => {
    try{
        const data = await repository.getByName(request.params.name);
        log("","Sucess","usefulcontacts-controller/getByName","resgatar dados");
        if(data === null){
            return response.status(400).send({ message: 'Usuario não existe'});
        }
        else{
            return response.status(200).send(data);
        }
       
    }catch(e) {
        log("","Error","usefulcontacts-controller/getByName","resgatar dados");

        return response.status(500).send({ message: 'Falha ao processar sua requisição'});
    }
}

exports.getByCity = async (request, response) => {
    const { city } = request.params
    try{
        const data = await repository.getByCity(city.toUpperCase());
        log("", "Sucess", "usefulcontacts-controller/getByCity", "resgatar dados por cidade");
        return data.length ? response.status(200).send(data) : response.status(404).send({ message: 'Cidade não encontrada. Tente novamente!' });
    }catch(e) {
        log("","Error","usefulcontacts-controller/getByCity","resgatar dados por cidade");

        return response.status(500).send({ message: 'Cidade não encontrada. Tente novamente!'});
    }
}

exports.getById = async(request, response) => {
    try{
        const data = await repository.getById(request.params.id)
        log("","Sucess","usefulcontacts-controller/getById","resgatar dados");
        return response.status(200).send(data);

        }catch(e) {
        log("","Error","usefulcontacts-controller/getById","resgatar dados");
        return response.status(500).send({ message: 'Falha ao processar sua requisição'});
    }
}


exports.post = async(request, response) => {
    let contract = new ValidationContract();
    contract.hasMinLen(request.body.name, 3, 'O Contato deve conter pelo menos 3 caracteres');
    contract.hasMinLen(request.body.number, 3, 'O Número deve conter pelo menos 3 caracteres');
    contract.hasMinLen(request.body.city, 3, 'O Nome da Cidade deve conter pelo menos 3 caracteres');    
    
    if(!contract.isValid()){
        log("","Warning","usefulcontacts-controller/post","validar contrato");
        return response.status(400).send(contract.errors()).end();
    }
    try {
    await repository.create(request.body);
        log("","Sucess","usefulcontacts-controller/post","cadastrar contato");
        return response.status(201).send({ message: 'Contato cadastrado com sucesso!' });
    }catch(e) {
        log("","Error","usefulcontacts-controller/post","cadastrar contato");
        return response.status(500).send({ message: 'Falha ao processar sua requisição'});
    }
}


exports.put = async (request, response) => {
    try{
    await repository.update(request.params.id, request.body);
        log("","Sucess","usefulcontacts-controller/put","atualizar contato");

        return response.status(200).send({ message: 'Contato atualizado com sucesso!'});
    }catch(e) {
        log("","Error","usefulcontacts-controller/put","atualizar contato");
        return response.status(500).send({ message: 'Falha ao processar sua requisição'});
    }
}

exports.delete = async(request, response) => {
    try{
    const data = await repository.getById(request.body.id)
    await repository.delete(request.body.id);
        log("","Sucess","usefulcontacts-controller/delete","remover contato");
        if (data !== null ) {
            return response.status(200).send({ message: 'Contato removido com sucesso!'});
        } else {
            return  response.status(400).send({ message: 'Usuário não existe'});
        }
    }catch(e) {
        log("","Error","usefulcontacts-controller/delete","remover contato");
        return response.status(500).send({ message: 'Falha ao processar sua requisição'});
    }
}



'user strict';

const ValidaContract = require('../validators/fluent-validator');
const repository = require('../repositories/friendContact-repository');
const log = require('../services/log-service');

exports.get = async (request, response) => {
    try {
        const data = await repository.get();
        log("", "Sucess", "friendContact-controller/get", "resgatar dados");
        return response.status(200).send(data);
    } catch (e) {
        log("", "Error", "frinedContact-controller/get", "resgatar dados: "+e);

        return response.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
}

exports.getByName = async (request, response) => {
    try {
        const data = await repository.getByName(request.params.name);
        log("", "Sucess", "friendContact-controller/getByName", "resgatar dados");
        return response.status(200).send(data);
    } catch (e) {
        log("", "Error", "friendContact-controller/get", "resgatar dados: "+e);

        return response.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
}

exports.getById = async (request, response) => {
    try {
        const data = await repository.getById(request.params.id)
        log("", "Sucess", "friendContact-controller/getById", "resgatar dados");

        return response.status(200).send(data);
    } catch (e) {
        log("", "Error", "friendContact-controller/getById", "resgatar dados: "+e);

        return response.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
}

exports.getByUser = async (request, response) => {
    try {
        const data = await repository.getByUser(request.params.id)

        log("", "Sucess", "friendContact-controller/getByUser", "resgatar dados");
        return response.status(200).send(data);
    } catch (e) {
        log("", "Error", "friendContact-controller/getByUser", "resgatar dados: "+e);

        return response.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
}

exports.post = async (request, response) => {
    const { id, name, number } = request.body;

    if (!id || !name || !number) {
        log("", "Warning", "friendContact-controller/post", "Informações faltando");
        return response.status(400).send(contract.errors()).end();
    }

    let contract = new ValidaContract();
    contract.hasMinLen(name, 3, 'O Contato deve conter pelo menos 3 caracteres');
    contract.hasMinLen(number, 3, 'O Número deve conter pelo menos 3 caracteres');


    if (!contract.isValid()) {
        log("", "Warning", "friendContact-controller/post", "validar contrato");
        return response.status(400).send(contract.errors()).end();
    }
    try {

        await repository.create({
            user: id,
            name,
            number
        })

        log("", "Sucess", "friendContact-controller/post", "cadastrar contato");

        return response.status(201).send({
            message: 'Contato criado com sucesso!'
        })
    } catch (e) {
        log("", "Error", "friendContact-controller/post", "cadastrar contato: "+e);
        return response.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
}

exports.put = async (request, response) => {
    try {
        const { name, number } = request.body;
        const { id } = request.params;


        if (!name || !number || !id) {
            return response.status(400).send({ message: "Dados incorretos ou faltando" }).end();
        }

        await repository.update({
            idContact: id,
            name: name,
            number: number
        });
        response.status(200).send({ message: 'Contato atualizado com sucesso!' });
        log("", "Sucess", "friendContact-controller/put", "atualizar contato");
    } catch (e) {

        response.status(500).send({ message: 'Falha ao processar sua requisição' });
        log("", "Error", "friendContact-controller/put", "atualizar contato: "+e);
    }
}


exports.delete = async (request, response) => {
    try {
        await repository.delete(request.params.id);

        log("", "Sucess", "friendContact-controller/delete", "remover contato");

        return response.status(200).send({ message: 'Contato removido com sucesso!' });
    } catch (e) {

        log("", "Error", "friendContact-controller/delete", "remover contato: "+e);

        return response.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
}

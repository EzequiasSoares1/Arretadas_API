'use strict';

const ValidationContract = require('../validators/fluent-validator');
const user = require('../repositories/userAdm-repository');
const authService = require('../services/auth-service')
const chalk = require('chalk');
const log = require('../services/log-service')
const { encryptPassword, comparePassword } = require('../services/encryption-service');


exports.post = async (request, response) => {
    let contract = new ValidationContract();
    const { name, password, city } = request.body;
    contract.hasMinLen(name, 3, 'O campo name deve conter pelo menos 3 caracteres');
    contract.hasMinLen(password, 6, 'O campo password deve conter pelo menos 6 caracteres');
    contract.hasMinLen(city, 3, 'O campo city deve conter pelo menos 3 caracteres');
  
    
    if (!contract.isValid()) {
        return response.status(400).send(contract.errors()).end();
    }

    try {

        let passwordEncrypted = await encryptPassword(password);

        let result = await user.create({
            name: name,
            password: passwordEncrypted,
            city: city.toLowerCase()
        });
        if (result === 201) {
            return response.status(result).send({ message: 'Usuário cadastrado com sucesso! '});
        } else {
            return response.status(400).send({ message: 'Este usuário ja existe' });
        }
        
    } catch (error) {
        console.log(error)
        log("", "Error", "user-controller/post", "cadastrar contato");
        return response.status(500).send({ message: 'Falha ao processar sua requisição', erro: error });
    }
}
exports.authenticate = async (request, response) => {
    try {
        const name = await request.body.name
        const userAuth = await user.authenticate({name});
        const password = await comparePassword(request.body.password, userAuth.password);

        if (!userAuth, !password) {
            log("", "Warning", "user-controller/authenticate", "erro de login");
            console.log(chalk.bgRed.white("FAILED TO LOGIN USER: ", name, " WITH PASS: ", request.body.password))
            return response.status(404).send({
                message: 'Usuário ou senha inválidos'
            });
        }

        const token = await authService.generateTokenAdm({name});

        return response.status(200).json({ token: token, city: userAuth.city });

    } catch (e) {
        console.log(e)
        log("", "Error", "userAdm-controller/authenticate", "validar login");
        return response.status(500).send({ message: 'Falha ao processar sua requisição (login)' });
    }
}

exports.validToken = async (request, response) => {
    const { oldToken } = request.body;
    try {
        await authService.decodeToken(oldToken);
        return response.status(200).send({ message: 'token ok' })

    } catch (error) {
        return response.status(401).send({ message: 'token inválido' })

    }
}

exports.read = async (request, response) => {
    const users = await user.readAll();
    return response.json(users);
}

exports.readOne = async (request, response) => {
    const userbyId = await user.readOnly(request.params.id);
    return response.json(userbyId);
}

exports.delete = async (request, response) => {
    const deleteUser = await user.deleteUser(request.params.id);
    if (deleteUser === null) return response.status(404).send({ message: 'Usuário inexistente!' });
    return response.status(200).send({ message: 'Usuário apagado com sucesso!' });
}

exports.update = async (request, response) => {
    const nameUser = request.body.name;
    const passwordEncrypted = await encryptPassword(request.body.password);
    const updateUser = await user.updateUser(request.params.id, nameUser, passwordEncrypted);
    if (updateUser === null) return response.status(404).send({ message: 'Usuário inexistente!' });
    return response.status(200).send({ message: 'Usuário editado com sucesso!' });
}

'use strict';
const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/user-repository');
const protectiveMeasureRepository = require('../repositories/protectiveMeasure-repository')
const md5 = require('md5');
const authService = require('../services/auth-service');
const chalk = require('chalk');
const log = require('../services/log-service')

exports.recoverPassword = async (request, response) => {
    const { id, newPassword } = request.body
    const isAleatoryQuestionsResponded = await repository.isAleatoryQuestionsResponded(id)
    if (isAleatoryQuestionsResponded) {
        if (!id || !newPassword) {
            return response.status(404).send({ message: "Usuário não encontrado" });
        }
        const newPass = {
            id: id,
            newPassword: md5(newPassword + global.SALT_KEY)
        }
        const result = await repository.updatePassword(newPass)
        if (result) {
            return response.status(200).send({ message: 'A senha foi atualizada com sucesso' });
        }
        return response.status(400).send({ message: 'A senha não foi atualizada com sucesso' });
    }
    return response.status(400).send({ message: 'Responda as questões' });


}

exports.recoverQuestions = async (request, response) => {
    const { nickname, indexQuestion, answerQuestion } = request.body;
    if (!nickname) {
        return response.status(400).send({ message: "informe um nickname" });
    }
    const user = await repository.getByNickname(nickname)
    if (!user) {
        return response.status(404).send({ message: "Usuário não encontrado" });
    }

    if (indexQuestion !== user.indexQuestion || answerQuestion !== user.answerQuestion) {
        return response.status(401).send({ message: "Não foi autorizado" });
    }

    const result = await repository.updateIsAleatoryQuestionsResponded(user._id)
    if (result) {
        return response.status(200).send(user);
    }
    return response.status(404).send({ message: "Não econtrado" });
}


exports.get = async (request, response) => {
    try {
        const data = await repository.get();
        log("", "Sucess", "user-controller/get", "resgatar dados");
        if (data === null) return response.status(404).send(data);
        return response.status(200).send(data);
    } catch (e) {
        log("", "Error", "user-controller/get", "resgatar dados");
        return response.status(500).send({ message: 'Falha ao processar sua requisição' });

    }
}

exports.getByNickname = async (request, response) => {
    try {
        const data = await repository.getByNickname(request.params.name);
        if (data == null) {
            return response.status(404).send({ message: "Não encontrado" });
        }
        log("", "Sucess", "user-controller/getByNickname", "resgatar dados");
        return response.status(200).send(data);
    } catch (e) {
        log("", "Error", "user-controller/getByNickname", "resgatar dados");
        return response.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
}

exports.getById = async (request, response) => {
    try {
        const data = await repository.getById(request.params.id)
        log("", "Sucess", "user-controller/getById", "resgatar dados");
        if (data === null) return response.status(404).send(data);
        return response.status(200).send(data);
    } catch (e) {
        log("", "Sucess", "user-controller/getById", "resgatar dados");
        return response.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
}
/*exports.getByAleatoryQuestions = async (request,response) => {
    try {
        const data = await repository.getByAleatoryQuestions(request.params.aleatory_question)
        log("", "Sucess", "user-controller/getByAleatoryQuestions", "resgatar dados");

        return response.status(200).send(data);
    } catch (e) {
        log("", "Sucess", "user-controller/getByAleatoryQuestions", "resgatar dados");

        return response.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
}*/


exports.post = async (request, response) => {
    let contract = new ValidationContract();
    contract.hasMinLen(request.body.nickname, 3, 'O nome deve conter pelo menos 3 caracteres');
    contract.hasMinLen(request.body.password, 6, 'O password deve conter pelo menos 6 caracteres');

    if (!contract.isValid()) {
        log("", "warning", "user-controller/post", "validar contrato");
        return response.status(400).send(contract.errors()).end();
    }
    let createdUser = null;

    if (request.body.protection_code) {
        const isValidCode = await protectiveMeasureRepository.validate(request.body.protection_code);

        if (!isValidCode || isValidCode.dataUtilizacao) {
            return response.status(400).send({ message: 'Código não encontrado ou já utilizado' });
        }
        else {
            createdUser = await createUser(request.body, isValidCode._id)
        }
    }
    else {
        createdUser = await createUser(request.body)
    }

    if (createdUser === null) {
        return response.status(500).send({ message: 'Falha ao processar sua requisição' })
    } else if (createdUser === 'user já cadastrado') {
        return response.status(409).send({ message: createdUser })
    } else {
        return response.status(201).send({ message: 'Usuário cadastrado com sucesso!' })
    }
}

const createUser = async (request, protectionCodeId) => {
    try {

        if (await repository.getByNickname(request.nickname) !== null) return 'user já cadastrado';

        const user = await repository.create({
            nickname: request.nickname,
            password: md5(request.password + global.SALT_KEY),
            city: request.city,
            protection_code: request.protection_code,
            indexQuestion: request.indexQuestion,
            answerQuestion: request.answerQuestion,
            roles: "user"
        });
        protectionCodeId ? await protectiveMeasureRepository.update(protectionCodeId) : ''

        log("", "Sucess", "user-controller/post", "cadastrar contato");
        return true
    } catch (error) {
        log(error)
        log("", "Error", "user-controller/post", "cadastrar contato");
        return false
    }
}


exports.put = async (request, response) => {
    try {
        let contract = new ValidationContract();
        contract.hasMinLen(request.body.nickname, 3, 'O nome deve conter pelo menos 3 caracteres');
        contract.hasMinLen(request.body.password, 6, 'O password deve conter pelo menos 6 caracteres');
    
        if (!contract.isValid()) {
            log("", "warning", "user-controller/post", "validar contrato");
            return response.status(400).send(contract.errors()).end();
        }
        const updateUser = await repository.update(request.params.id, {
            nickname: request.body.nickname,
            password: md5(request.body.password + global.SALT_KEY),
            protection_code: request.body.protection_code
        });

        if (updateUser === 'user not found') return response.status(404).send({ message: ' usuario não encontrado' });
        else if (updateUser === "nickname já existe") return response.status(404).send({ message: "nickname já existe" });
        else {
            log("", "Sucess", "user-controller/put", "atualizar contato");
            return response.status(200).send({ message: 'User atualizado com sucesso!' });
        }

    } catch (error) {
        log(error)
        log("", "Error", "user-controller/put", "atualizar contato");
        return response.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
}

exports.delete = async (request, response) => {
    try {
    
        const data = await repository.getById(request.body.id)
        if(data === null) return response.status(404).send(data);

        await repository.delete(request.body.id);
        log("", "Sucess", "user-controller/delete", "remover contato");

        return response.status(200).send({ message: 'User removido com sucesso!' });
    } catch (e) {
        log("", "Error", "user-controller/delete", "remover contato");

        return response.status(500).send({ message: 'Falha ao processar sua requisição, id invalido'});
    }
}

exports.authenticate = async (request, response) => {
    try {
        const { nickname, password } = request.body
        const user = await repository.authenticate({
            nickname,
            password: md5(password + global.SALT_KEY)
        });
        if (!user) {
            log("", "Warning", "user-controller/authenticate", "erro de login");
            console.log(chalk.bgRed.white("FAILED TO LOGIN USER: ", nickname, " WITH PASS: ", password))
            return response.status(404).send({
                message: 'Usuário ou senha inválidos'
            });
        }

        const token = await authService.generateToken({
            nickname: user.nickname,
            id: user._id,
            city: user.city,
            protection_code: user.protection_code,
            aleatory_questions: user.aleatory_questions,
            roles: user.roles
        });

        return response.status(200).send(
            {
                token: token,
                data: {
                    nickname: user.nickname,
                    id: user._id,
                    city: user.city,
                    roles: user.roles
                }
            }
        );
    } catch (e) {
        log("", "Error", "user-controller/authenticate", "validar login");

        return response.status(500).send({ message: 'Falha ao processar sua requisição (login)' });
    }
}

exports.refreshToken = async (request, response) => {

    const oldToken = request.body.token || request.query.token || request.headers['x-access-token'];
    const user = request.body
    let data;
    let token;

    if (!user.nickname || !user.id || !oldToken) {
        log("", "Error", "user-controller/refreshToken", "validar login");
        return response.status(404).send({ message: 'Informe um nickname, um id e o token antigo' });
    }

    try {
        log
        data = await authService.decodeToken(oldToken);
        if (data.id !== user.id) {
            return response.status(400).send({ message: 'O token informado não pertence ao usuário' });
        }

        token = oldToken;
    } catch (err) {

        if (err.name !== 'TokenExpiredError') {
            return response.status(400).send({ message: 'Informe um token expirado e não inválido' })
        }
        const newToken = await authService.generateToken(user)
        data = await authService.decodeToken(newToken);
        token = newToken
    }

    return response.status(200).send(
        {
            token: token,
            data: {
                nickname: data.nickname,
                id: data.id,
                city: data.city
            }
        }
    );
}
exports.updatePassword = async (request, response) => {
    try {
        const user = {
            id: request.body.id,
            nickname: request.body.nickname,
            newPassword: md5(request.body.newPassword + global.SALT_KEY),
            oldPassword: md5(request.body.oldPassword + global.SALT_KEY)
        }
        const auth = await repository.authenticate({
            nickname: user.nickname,
            password: user.oldPassword
        })
        if (!auth) {
            log("", "Error", "user-controller/updatePassword", "Alterar senha");

            return response.status(401).send({ message: 'Senha atual inválida' });

        } else {
            await repository.updatePassword(user);
            log("", "Sucess", "user-controller/updatePassword", "Alterar senha");

            return response.status(200).send({ message: 'Senha alterada com Sucesso!' });
        }
    } catch (e) {
        log("", "Error", "user-controller/updatePassword", "Alterar senha");

        return response.status(500).send({ message: 'Falha ao processar sua requisição' });
    }

}


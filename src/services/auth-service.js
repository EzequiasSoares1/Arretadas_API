'use strict';

const chalk = require('chalk');
const jwt = require('jsonwebtoken');
const log = require('../services/log-service');

exports.generateToken = async (data) => {
    log("", "Info", "auth-service/generateToken", "gerar token ok");
    return jwt.sign(data, global.SALT_KEY, { expiresIn: '1d' });

}

exports.generateTokenAdm = async (data) => {
    log("", "Info", "auth-service/generateToken", "gerar token ok");
    return jwt.sign(data, global.SALT_KEY, { expiresIn: '1d' });

}

exports.decodeToken = async (token) => {
    var data = await jwt.verify(token, global.SALT_KEY);
    log("", "Info", "auth-service/decodeToken", "decode token ok");
    return data;
}

exports.authorize = function (req, res, next) {

    let token = req.headers['authorization'];

    if (!token) {
        log("", "warning", "auth-service/authorize", "Token Invalido");
        res.status(401).json({
            message: 'Acesso Restrito'
        });
    } else {
        token = token.split(' ')[1]
        jwt.verify(token, global.SALT_KEY, function (error, decoded) {
            if (error) {
                log("", "Error", "auth-service/authorize", "Token Invalido");
                res.status(401).json({
                    message: 'Token Inválido'
                });
            } else {
                next();
            }
        });
    }
};

exports.isAdmin = function (req, res, next) {
    var token = req.headers['authorization'].split(' ')[1]

    if (!token) {
        log("", "warning", "auth-service/isAdmin", "Token Invalido");
        res.status(401).json({
            message: 'Token Inválido'
        });
    } else {
        jwt.verify(token, global.SALT_KEY, function (error, decoded) {
            if (error) {
                log("", "Error", "auth-service/isAdmin", "Token Invalido");
                res.status(401).json({
                    message: 'Token Inválido'
                });
            } else {
                if (decoded.roles.includes('admin')) {
                    next();
                } else {
                    log("", "Info", "auth-service/isAdmin", "Acesso Negado");
                    res.status(403).json({
                        message: 'Esta funcionalidade é restrita para administradores'
                    });
                }
            }
        });
    }
};
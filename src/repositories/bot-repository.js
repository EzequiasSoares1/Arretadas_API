'use strict';

const chalk = require('chalk');
const mongoose = require('mongoose');
const Bot = mongoose.model('Bot');
const shell = require('shelljs');

exports.status = async () =>{
    const result = await Bot.find();
    return result[0].status ? 'Ligado' : 'Desligado'
}
exports.down = async () =>{
    const bot = await Bot.findById('62af70b23c8bb94a909d0d14');
    if(bot.status){
        bot['status'] = false
        const cmd ='sh ./Arretadas-bot/stop.sh'
        const exec = await shell.exec(cmd);
        await bot.save();
        return 'Desligado'
    }
    return 'Já está desligado';
}
exports.up = async () =>{
    const bot = await Bot.findById('62af70b23c8bb94a909d0d14');

    if(!bot.status){
        const cmd ='sh ./Arretadas-bot/init.sh'
        await shell.exec(cmd);
        bot['status'] = true
        await bot.save();
        return  'Ligado'
    }
    return 'Já está ligado'
}
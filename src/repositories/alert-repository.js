'use strict';

const chalk = require('chalk');
const mongoose = require('mongoose');
const Alert = mongoose.model('Alert');

exports.get = async (dates, city) => {
    const res = await Alert.find({
        date: { $gte: dates.init, $lte: dates.final },
        city
    }).populate('user', 'nickname');
    return res;
}

exports.create = async (data) => {
    var alert = new Alert(data);
    await alert.save();
}

exports.delete = async (id) => {
    await Alert.findByIdAndRemove(id)
}
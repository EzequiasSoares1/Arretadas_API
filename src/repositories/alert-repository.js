'use strict';

const chalk = require('chalk');
const mongoose = require('mongoose');
const Alert = mongoose.model('Alert');

exports.getByDate = async (dates, city) => {
    const res = await Alert.find({
        date: { $gte: dates.init, $lte: dates.final },
        city
    }).populate('user', 'nickname');
    return res;
}
exports.getByCity = async (city) => {
    const res = await Alert.find({ city });
    return res;
}

exports.getById = async (id) => {
    return Alert.findById(id);
}

exports.get = async () => {
    return Alert.find();
}

exports.getByUserId = async (id) => {
    return Alert.find({ user: id });
}

exports.create = async (data) => {
    var alert = new Alert(data);
    await alert.save();
}

exports.delete = async (id) => {
    await Alert.findByIdAndDelete({ _id: id });
}


exports.put = async (data) => {
    const userRequest = await this.getById(data._id);

    if (userRequest === null) return null;
    if (data.latitude !== null) userRequest.latitude = data.latitude;
    if (data.longitude !== null) userRequest.longitude = data.longitude;
    const res = await Alert.findByIdAndUpdate({ _id: data._id }, userRequest);
    return res;
}

exports.getByPeriod = async (startDate, endDate) => {
    const alerts = await Alert.find({
        date: { $gte: startDate, $lte: endDate }
    }).select('latitude longitude hour');

    return alerts;
};
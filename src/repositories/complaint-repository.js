'use strict';

const chalk = require('chalk');
const mongoose = require('mongoose');
const Complaint = mongoose.model('Complaint');


exports.get = async () => {
    return await Complaint.find();
}

exports.getById = async (id) => {
    return await Complaint.findOne({_id: id});
}

exports.getByCity = async (data) => {
    return await Complaint.find({city: new RegExp(data, 'i')});
}

exports.getByTypeAndCity = async (type, city) => {
    return await Complaint.find({ 
        type_complaint:  new RegExp(type, 'i'),
        city: new RegExp(city, 'i')
    });
}

exports.getByLocalization = async (latitude, longitude) => {
    return await Complaint.find({ 
        latitude: latitude,
        longitude: longitude
    });
}

exports.getByType = async (type) => {      
    return await Complaint.find({ type_complaint: new RegExp(type, 'i') });
}

exports.getByUser = async (id) => {
    return await Complaint.find({user: id});
}

exports.getByDate = async (dates, city) => {
    const res = await Complaint.find({
        date: { $gte: dates.startDate, $lte: dates.endDate},
        city: new RegExp(city, 'i')
    })
    
    console.log(chalk.bgBlueBright.black("COMPLAINT RESULT SET: ", res.length))
    return res;
}

exports.create = async (data) => {
    var complaint = new Complaint(data);
    return await complaint.save();
}

exports.delete = async (id) => {
    await Complaint.findByIdAndDelete(id);
}

exports.update = async (data) => {
    const userRequest = this.getById(data.id);

    if (userRequest === null) return null;

    if (data.latitude !== null) userRequest.latitude = data.latitude;
    if (data.longitude !== null) userRequest.longitude = data.longitude;
    if (data.type !== null && data.type[0] != null) userRequest.type_complaint = data.type;

    return await Complaint.findByIdAndUpdate({ _id: data.id }, userRequest);
}

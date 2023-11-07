'use strict';

const mongoose = require('mongoose');
const UsefulContacts = mongoose.model('UsefulContacts');

exports.get = async () => {
    return await UsefulContacts.find({}, '_id name number city');
}

exports.getById = async (id) => {
    return await UsefulContacts.findById(id, '_id name number city');
}

exports.getByName = async (name) => {
    return await UsefulContacts.findOne({ name: name }, '_id name number city');
}

exports.getByCity = async (city) => {
    return await UsefulContacts.find({ city }, '_id name number city');
}

exports.create = async (data) => {
    const usefulContacts = new UsefulContacts(data);
    await usefulContacts.save();
}

exports.update = async (id, data) => {
    await UsefulContacts.findByIdAndUpdate(id, {
        $set: {
            name: data.name,
            number: data.number,
            city: data.city
        }
    });
}
exports.delete = async(id) => {    
    await UsefulContacts.findByIdAndRemove(id);
}
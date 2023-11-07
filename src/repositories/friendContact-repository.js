'use strict';

const mongoose = require('mongoose');
const FriendContact = mongoose.model('FriendContact');

exports.get = async () => {
    const res = await FriendContact.find({}).populate('user','_id nickname');
    return res;
}
exports.getById = async (id) => {
    const res = await FriendContact.findById(id, '_id name number').populate('user','_id nickname');
    return res;
}
exports.getByName = async (name) => {
    const res = await FriendContact.findOne({ name }, '_id name number').populate('user','_id nickname');
    return res;

}
exports.getByUser = async (id) => {
    const res = await FriendContact.find({ user: id }, 'name number');
    return res;

}

exports.create = async (data) => {
    var friend = new FriendContact(data);
    await friend.save();
}

exports.delete = async (id) => {
    await FriendContact.findByIdAndRemove(id);

}
exports.update = async (data) => {
    await FriendContact.findByIdAndUpdate(data.idContact, {
        $set: {
            name: data.name,
            number: data.number
        }
    });
}

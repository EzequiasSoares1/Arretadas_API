'use strict';

const mongoose = require("mongoose");
const { log } = require("sharp/lib/libvips");
const UserAdm = mongoose.model('UserAdm')

exports.create = async (data) => {
    let user = new UserAdm(data);

    try {
        await user.save();
        return 201
    } catch (error) {
        return error
    }
}

exports.authenticate = async (data) => {
    const res = await UserAdm.findOne({name: data.name});
    return res;
}

exports.readAll = async () => {
    const res = await UserAdm.find();
    return res;
}

exports.readOnly = async (id) => {
    const res = await UserAdm.findById({_id: id});
    return res;
}

exports.deleteUser = async(id) => {
    const res = await UserAdm.findByIdAndDelete({_id: id});
    return res;
}

exports.updateUser = async(id, name, password) => {
    const userRequest = this.readOnly(id);
    if(userRequest !== null) {
        if(name !== null) userRequest.name = name;
        if(password !== null) userRequest.password = password;
        const res = await UserAdm.findByIdAndUpdate({_id: id}, userRequest);
        return res;
    }
    return null;
}

/*
TODO: ROUTE OF AUTHENTICATE
AND REFACTOR THE CODE
*/
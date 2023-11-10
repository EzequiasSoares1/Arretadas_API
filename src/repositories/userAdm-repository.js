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
    const res = await UserAdm.findOne({ name: data.name });
    return res;
}

exports.readAll = async () => {
    const res = await UserAdm.find();
    return res;
}
exports.readName = async (name) => {
    const res = await UserAdm.findOne({ name: name });
    if (res !== null) res.password = null;
    return res;
}
exports.readOnly = async (id) => {
    const res = await UserAdm.findById({ _id: id });
    if (res !== null) res.password = null;
    return res;
}

exports.deleteUser = async (id) => {
    const res = await UserAdm.findByIdAndDelete({ _id: id });
    return res;
}

exports.updateUser = async (id, name, password) => {
    const userRequest = await this.readOnly(id);

    if (userRequest === null) {
        return null;
    }

    if (name !== null) {
        const userName = await this.readName(name);

        if (userName !== null) {
            console.log(userName)
            if (userName.name !== userRequest.name) return null;
        }
    }

    if (name !== null) userRequest.name = name;
    if (password !== null) userRequest.password = password;
    const res = await UserAdm.findByIdAndUpdate({ _id: id }, userRequest);
    return res;
}
/*
TODO: ROUTE OF AUTHENTICATE
AND REFACTOR THE CODE
*/
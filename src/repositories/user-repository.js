'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.get = async () => {
    const res = await User.find(
        {}, '_id nickname city protection_code ');
    return res;
}

exports.getByCity = async (city) => {
    return await User.find({ city: { $regex: new RegExp(city, 'i') } }, '_id nickname city protection_code ');
}

exports.getById = async (id) => {
    const res = await User.findById(id, '_id nickname city protection_code ');
    return res;
}

exports.getByNickname = async (nickname) => {
    const res = await User.findOne({
        nickname: nickname
    }, '_id nickname protection_code indexQuestion answerQuestion');
    return res;

}

/*exports.getByAleatoryQuestions = async(aleatory_question) => {
    const res = await User.find({
        : aleatory_question
    });
    return res;
}*/

exports.create = async (data) => {
    var user = new User(data);
    await user.save();

}

exports.update = async (id, data) => {
    const userRequest = await this.getById(id);
    
    if (userRequest === null) {
        return 'user not found';
    }
    const userName = await this.getByNickname(data.nickname);

    if (userName !== null) {
      

        if (userName.nickname !== userRequest.nickname)
            return "nickname já existe";
    }

    await User.findByIdAndUpdate(id, {
        $set: {
            nickname: data.nickname,
            password: data.password,
            protection_code: data.protection_code
        }
    });
    return true;

}

exports.delete = async (id) => {
    await User.findByIdAndRemove(id);
}

exports.authenticate = async (data) => {
    const res = await User.findOne(
        {
            nickname: data.nickname,
            password: data.password
        }
    );
    return res;
}
exports.updatePassword = async (data) => {
    try {

        const user = await User.findByIdAndUpdate(data.id, {
            $set: {
                password: data.newPassword,
                isAleatoryQuestionsResponded: false
            }
        })
        return true
    } catch (error) {
        return false
    }
}

exports.updateIsAleatoryQuestionsResponded = async (id) => {
    try {
        const user = await User.findByIdAndUpdate(id, {
            $set: {
                isAleatoryQuestionsResponded: true
            }
        })
        return true;
    } catch (error) {
        return false
    }
}
exports.isAleatoryQuestionsResponded = async (id) => {
    try {
        const user = await User.findOne({
            _id: id
        }, "isAleatoryQuestionsResponded")
        return user.isAleatoryQuestionsResponded === null ? false : user.isAleatoryQuestionsResponded;
    } catch (error) {
        return false
    }
}
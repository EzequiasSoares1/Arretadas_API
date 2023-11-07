'use strict';

const chalk = require('chalk');
const mongoose = require('mongoose');
const Complaint = mongoose.model('Complaint');

exports.get = async (dates, city) => {
    const res = await Complaint.find({
        date: { $gte: dates.init, $lte: dates.final },
        city
    })
    
    console.log(chalk.bgBlueBright.black("COMPLAINT RESULT SET: ", res.length))
    return res;
    

}

exports.create = async (data) => {
    var complaint = new Complaint(data);
    return await complaint.save();
}

exports.delete = async (id) => {
    await Complaint.findByIdAndRemove(id)
}
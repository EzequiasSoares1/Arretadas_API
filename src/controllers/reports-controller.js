'use strict';
const moment = require('moment');
const users = require('../repositories/user-repository');
const usersAdm = require('../repositories/userAdm-repository');
const alerts = require('../repositories/alert-repository');
const complaints = require('../repositories/complaint-repository');
const log = require('../services/log-service');
const byLocalization = require('../services/geocoding-service')
const treatment = require('../services/treatment-service');

exports.usersAdm = async (request, response) => {
    try {
        const allUsersADM = await usersAdm.get();
        const amountUsersAdm = allUsersADM.length;
        const usersAdmByCity = allUsersADM.reduce((acc, user) => {
            acc[user.city] = (acc[user.city] || 0) + 1;
            return acc;
        }, {});

        log("", "Sucess", "complaint-controller/usersAdm", "Buscar resumo de usuarios adm");
        return response.json({ amountUsersAdm, usersAdmByCity });
    } catch (error) {
        console.error('Error:', error);
        return response.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.usersAll = async (request, response) => {
    try {
        const allUsers = await users.get();
        const amountUsers = allUsers.length;
        const usersByCity = allUsers.reduce((acc, user) => {
            acc[user.city] = (acc[user.city] || 0) + 1;
            return acc;
        }, {});
        log("", "Sucess", "complaint-controller/usersAll", "Buscar resumo de usuarios");
        return response.json({ amountUsers, usersByCity });
    } catch (error) {
        console.error('Error:', error);
        return response.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.usersAllByCity = async (request, response) => {
    try {
        const allUsers = await users.getByCity(request.query.city);
        const amountUsers = allUsers.length;

        log("", "Sucess", "complaint-controller/usersAll", "Buscar resumo de usuarios");
        return response.json({ amountUsers });
    } catch (error) {
        console.error('Error:', error);
        return response.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.complaints = async (request, response) => {
    try {
        const complaint = await complaints.get();
        const amountComplaints = complaint.length;

        const complaintsByType = {};
        const complaintsByCity = {};

        complaint.forEach(complaint => {
            const types = complaint.type_complaint;
            types.forEach(type => {
                if (complaintsByType[type]) {
                    complaintsByType[type]++;
                } else {
                    complaintsByType[type] = 1;
                }
            });

            const city = complaint.city;
            if (complaintsByCity[city]) {
                complaintsByCity[city]++;
            } else {
                complaintsByCity[city] = 1;
            }
        });

        const summary = {
            amountComplaints,
            complaintsByCity,
            complaintsByType

        };

        log("", "Sucess", "complaint-controller/Complaints", "Buscar resumo das denúncias");
        return response.status(200).send(summary);
    } catch (e) {
        log("", "Error", "complaint-controller/Complaints", "Buscar resumo das denúncias: " + e);
        return response.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
};

exports.complaintsCity = async (request, response) => {
    try {
        const city = request.query.city;
        const complaintsByCity = await complaints.getByCity(city);
        const summary = await treatment.summaryComplaint(complaintsByCity);
      
        log("", "Success", "complaint-controller/complaintsCity", "Buscar resumo por cidade");
        return response.status(200).send(summary);
    } catch (e) {
        log("", "Error", "complaint-controller/ComplaintsCity", "Buscar resumo por cidade: " + e);
        return response.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
};

exports.complaintsPeriod = async (request, response) => {

    try {
        const { startDate, endDate, city } = request.query

        const period = await complaints.getByDate({ startDate, endDate }, city);
        const summary = await treatment.summaryComplaint(period);

        log("", "Sucess", "complaint-controller/complaintsPeriod", "Buscar por data");
        return response.status(200).send(summary)

    } catch (e) {
        log("", "Error", "complaint-controller/complaintsPeriod", "Buscar por data: " + e);
        return response.status(500).send({ message: 'Falha ao processar sua requisição.' });
    }
};

exports.alerts = async (request, response) => {
    try {
        const data = await alerts.get();

        if (!data || data.length === 0) {
            return response.status(404).send({ message: 'Nenhum dado encontrado' });
        }

        const totalAlerts = data.length;

        const groupedAlerts = {};

        data.forEach(alert => {
            const key = `${alert.city}`;
            if (!groupedAlerts[key]) {
                groupedAlerts[key] = {
                    city: alert.city,
                    locations: []
                };
            }

            let existingCityLocation = null;
            groupedAlerts[key].locations.forEach(loc => {
                if (loc.latitude === alert.latitude && loc.longitude === alert.longitude) {
                    existingCityLocation = loc;
                }
            });

            if (existingCityLocation) {
                if (!existingCityLocation.intervals.includes(alert.hour)) {
                    existingCityLocation.intervals.push(alert.hour);
                }
            } else {
                groupedAlerts[key].locations.push({
                    latitude: alert.latitude,
                    longitude: alert.longitude,
                    intervals: [alert.hour]
                });
            }
        });

        const formattedData = Object.values(groupedAlerts);

        const responseData = {
            totalAlerts: totalAlerts,
            alertsByCityAndLocation: formattedData
        };

        log("", "Success", "alerts-controller/alerts", "Dados de alerta recuperados com sucesso");
        return response.status(200).send(responseData);
    } catch (e) {
        log("", "Error", "alerts-controller/alerts", "Erro ao processar dados de alerta: " + e);
        return response.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
};

exports.alertsPeriod = async (request, response) => {
    try {
        const { startDate, endDate, city } = request.query
        
        const data = await alerts.getByDatePeriod({startDate, endDate}, city);
        const summary = await treatment.summaryAlerts(data);
        
        log("", "Success", "alerts-controller/alertsPeriod", "Dados de alerta por período e cidade recuperados com sucesso");
        return response.status(200).send(summary);
    } catch (e) {
        log("", "Error", "alerts-controller/alertsPeriod", "Erro ao processar dados de alerta por período e cidade: " + e);
        return response.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
};

exports.alertsCity = async (request, response) => {
    try {
        const { city } = request.query;
        const data = await alerts.getByCity(city);
        const summary = await treatment.summaryAlerts(data);

        log("", "Success", "alerts-controller/alertsCity", "Dados de alerta por cidade recuperados com sucesso");
        return response.status(200).send(summary);
    } catch (e) {
        log("", "Error", "alerts-controller/alertsCity", "Erro ao processar dados de alerta por cidade: " + e);
        return response.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
};
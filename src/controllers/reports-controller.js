'use strict';

const users = require('../repositories/user-repository');
const usersAdm = require('../repositories/userAdm-repository');
const alerts = require('../repositories/alert-repository');
const complaints = require('../repositories/complaint-repository');
const log = require('../services/log-service');
const byLocalization = require('../services/geocoding-service')


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
        const allUsers = await users.getByCity(request.params.city);
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
}

exports.complaintsCity = async (request, response) => {
    try {
        const city = request.params.city;
        const complaintsByCity = await complaints.getByCity(city);

        const amountByType = {};
        complaintsByCity.forEach(complaint => {
            complaint.type_complaint.forEach(type => {
                if (amountByType[type]) {
                    amountByType[type]++;
                } else {
                    amountByType[type] = 1;
                }
            });
        });

        const amountComplaintsByCity = complaintsByCity.length;

        const locationsAndTimesMap = {};
        complaintsByCity.forEach(complaint => {
            const locationKey = `${complaint.latitude},${complaint.longitude}`;
            if (!locationsAndTimesMap[locationKey]) {
                locationsAndTimesMap[locationKey] = { times: [complaint.hour], dates: [complaint.date], occurrences: 1 };
            } else {
                locationsAndTimesMap[locationKey].times.push(complaint.hour);
                locationsAndTimesMap[locationKey].dates.push(complaint.date);
                locationsAndTimesMap[locationKey].occurrences++;
            }
        });

        const locationsAndTimes = await Promise.all(Object.entries(locationsAndTimesMap).map(async ([location, data]) => {
            const [latitude, longitude] = location.split(',');
            const address = await byLocalization(latitude, longitude);
            return {
                Rua: address === undefined ? "Não Localizado" : address.Rua,
                Bairro: address === undefined ? "Não Localizado" : address.Bairro,
                location: location.split(','),
                hours: Array.from(new Set(data.times)),
                dates: Array.from(new Set(data.dates)),
                occurrences: data.occurrences
            };
        }));

        const summary = {
            amountComplaintsByCity,
            complaintsByType: amountByType,
            locationsAndTimes
        };

        log("", "Success", "complaint-controller/complaintsCity", "Buscar resumo por cidade");
        return response.status(200).send(summary);
    } catch (e) {
        log("", "Error", "complaint-controller/ComplaintsCity", "Buscar resumo por cidade: " + e);
        return response.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
}

exports.complaintsPeriod = async (request, response) => {

    try {
        const { init, final, city } = request.query
        const typeComplaint = request.query.type;
        const initValid = moment(init).isValid()
        const finalValid = moment(final).isValid()
        const validCitys = ['garanhuns', 'monteiro', 'cidade n/d']

        if (!initValid || !finalValid || !city || !validCitys.some(validCity => validCity === city.toLowerCase())) {
            log("", "Warning", "complaint-controller/getByDate", `. Data Inicial: ${init} / Data final: ${final}`);
            return response.status(400).send({ message: "data ou cidade inválida" })
        }

        const data = await repository.getByDate({ init, final }, city.toLowerCase())
        const result = await treatComplaint.treatment({ data, init, final, typeComplaint });

        log("", "Sucess", "complaint-controller/complaintsPeriod", "Buscar por data");
        return response.status(200).send(result)

    } catch (e) {
        log("", "Error", "complaint-controller/complaintsPeriod", "Buscar por data: " + e);
        return response.status(500).send({ message: 'Falha ao processar sua requisição.' });
    }
}

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
        const { city, startDate, endDate } = request.query;

        const start = new Date(startDate);
        const end = new Date(endDate);

        const data = await alerts.getByPeriod(city, start, end);

        if (!data || data.length === 0) {
            return response.status(404).send({ message: 'Nenhum dado encontrado' });
        }

        let totalAlerts = 0;
        const locations = {};

        data.forEach(alert => {
            totalAlerts++;

            const { latitude, longitude, hour } = alert;
            const key = `${latitude},${longitude}`;

            if (!locations[key]) {
                locations[key] = {
                    latitude: latitude,
                    longitude: longitude,
                    intervals: [hour]
                };
            } else {
                if (!locations[key].intervals.includes(hour)) {
                    locations[key].intervals.push(hour);
                }
            }
        });

        const responseData = {
            totalAlerts: totalAlerts,
            locations: Object.values(locations)
        };

        log("", "Success", "alerts-controller/alertsPeriod", "Dados de alerta por período e cidade recuperados com sucesso");
        return response.status(200).send(responseData);
    } catch (e) {
        log("", "Error", "alerts-controller/alertsPeriod", "Erro ao processar dados de alerta por período e cidade: " + e);
        return response.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
};

exports.alertsCity = async (request, response) => {
    try {
        const { city } = request.query;
        const data = await alerts.getByCity(city);

        const amountAlertByCity = data.length;
        console.log(data)

        const responseData = {};

        for (const alert of data) {
            const { latitude, longitude, date, hour, user } = alert;
            const address = await byLocalization(latitude, longitude);
            const victim = await users.getById(user);
            const key = `${latitude},${longitude}`;

            if (!responseData[key]) {
                responseData[key] = {
                    medidaProtetiva: victim.protection_code === undefined || null ? "Sem Medida Protetiva" : victim.protection_code,
                    location: {
                        latitude: latitude,
                        longitude: longitude,
                        Rua: address === undefined ? "Não Localizado" : address.Rua,
                        Bairro: address === undefined ? "Não Localizado" : address.Bairro
                    },
                    dates: [{ date: date, hours: [hour] }]
                };
            } else {
                const existingDateIndex = responseData[key].dates.findIndex(item => item.date === date);
                if (existingDateIndex === -1) {
                    responseData[key].dates.push({ date: date, hours: [hour] });
                } else {
                    responseData[key].dates[existingDateIndex].hours.push(hour);
                }
            }
        }

        const locations = Object.values(responseData);

        const resume = {
            amountAlertByCity: amountAlertByCity,
            information: locations
        };

        log("", "Success", "alerts-controller/alertsCity", "Dados de alerta por cidade recuperados com sucesso");
        return response.status(200).send(resume);
    } catch (e) {
        log("", "Error", "alerts-controller/alertsCity", "Erro ao processar dados de alerta por cidade: " + e);
        return response.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
};

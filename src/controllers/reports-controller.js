'use strict';

const users = require('../repositories/user-repository');
const usersAdm = require('../repositories/userAdm-repository');
const alerts = require('../repositories/alert-repository');
const complaints = require('../repositories/complaint-repository');
const log = require('../services/log-service');
const byLocalizatio = require('../services/geocoding-service')


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
                locationsAndTimesMap[locationKey] = { times: [complaint.hour], occurrences: 1 };
            } else {
                locationsAndTimesMap[locationKey].times.push(complaint.hour);
                locationsAndTimesMap[locationKey].occurrences++;
            }
        });

        const locationsAndTimes = await Promise.all(Object.entries(locationsAndTimesMap).map(async ([location, data]) => {
            const [latitude, longitude] = location.split(',');
            const { Rua, Bairro } = await byLocalizatio(latitude, longitude);
            return {
                Rua,
                Bairro,
                location: location.split(','),
                times: Array.from(new Set(data.times)),
                occurrences: data.occurrences
            };
        }));

        const summary = {
            amountComplaintsByCity: amountComplaintsByCity,
            complaintsByType: amountByType,
            locationsAndTimes: locationsAndTimes
        };

        log("", "Sucess", "complaint-controller/complaintsCity", "Buscar resumo por cidade");
        return response.status(200).send(summary);
    } catch (e) {
        log("", "Error", "complaint-controller/ComplaintsCity", "Buscar resumo por cidade: " + e);
        return response.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
}

exports.complaintsTypeAndCity = async (request, response) => {
    try {
        const type = request.params.type;
        const city = request.params.city;

        const complaint = await complaints.getByTypeAndCity(type, city);

        const locationsAndTimesMap = {};

        complaint.forEach(complaint => {
            const locationKey = `${complaint.latitude},${complaint.longitude}`;
            if (!locationsAndTimesMap[locationKey]) {
                locationsAndTimesMap[locationKey] = { times: [complaint.date + ' ' + complaint.hour], occurrences: 1 };
            } else {
                locationsAndTimesMap[locationKey].times.push(complaint.date + ' ' + complaint.hour);
                locationsAndTimesMap[locationKey].occurrences++;
            }
        });

        const locationsAndTimes = Object.entries(locationsAndTimesMap).map(([location, data]) => ({
            location: location.split(','),
            times: Array.from(new Set(data.times)), 
            occurrences: data.occurrences
        }));

        const responseObj = {
            locationsAndTimes: locationsAndTimes
        };

        log("", "Success", "complaint-controller/complaintsTypeAndCity", "Buscar por tipo e cidade");
        return response.status(200).send(responseObj);
    } catch (e) {
        log("", "Error", "complaint-controller/complaintsTypeAndCity", "Buscar por tipo e cidade: " + e);
        return response.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
}

exports.complaintsLocalization = async (request, response) => {
    try {
        const complaint = await complaints.getByLocalization(request.query.latitude, request.query.longitude);
        
        const complaintsByType = {};
        const uniqueDates = new Set();
        const intervals = {};

        complaint.forEach(complaint => {
            complaint.type_complaint.forEach(type => {
                if (complaintsByType[type]) {
                    complaintsByType[type]++;
                } else {
                    complaintsByType[type] = 1;
                }
            });

            const date = new Date(complaint.date);
            const formattedDate = date.toISOString().split('T')[0];
            uniqueDates.add(formattedDate);

            const hour = complaint.hour.split(':')[0];
            const interval = `${hour}:00-${hour}:59`;
            if (intervals[interval]) {
                intervals[interval]++;
            } else {
                intervals[interval] = 1;
            }
        });

        const totalComplaints = complaint.length;

        const responseObj = {
            totalComplaints: totalComplaints,
            complaintsByType: complaintsByType,
            uniqueDates: Array.from(uniqueDates),
            intervals: intervals
        };

        log("", "Success", "complaint-controller/complaintsLocalization", "Buscar por localizacao");
        return response.status(200).send(responseObj);

    } catch (e) {
        log("", "Error", "complaint-controller/complaintsLocalization", "Buscar por localizacao: "+e);
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
        const result = await treatComplaint.treatment({data, init, final, typeComplaint});

        log("", "Sucess", "complaint-controller/complaintsPeriod", "Buscar por data");
        return response.status(200).send(result)

    } catch (e) {
        log("", "Error", "complaint-controller/complaintsPeriod", "Buscar por data: "+e);
        return response.status(500).send({ message: 'Falha ao processar sua requisição.' });
    }
}

exports.complaintsPeriod = async (request, response) => {
    try {
        const startDate = new Date(request.query.startDate);
        const endDate = new Date(request.query.endDate);
        const city = request.query.city;

        const complaint = await complaints.getByDateAndCity(startDate, endDate, city);
        
        const totalComplaints = complaint.length;

        const complaintsByType = {};
        const uniqueLocations = {};  
        const intervals = {};

        complaint.forEach(complaint => {
            complaint.type_complaint.forEach(type => {
                if (complaintsByType[type]) {
                    complaintsByType[type]++;
                } else {
                    complaintsByType[type] = 1;
                }
            });

            const hour = complaint.hour.split(':')[0];
            const interval = `${hour}:00-${hour}:59`;
            if (intervals[interval]) {
                intervals[interval]++;
            } else {
                intervals[interval] = 1;
            }

            const location = `${complaint.latitude},${complaint.longitude}`;
            if (!uniqueLocations[location]) {
                uniqueLocations[location] = {};
            }
            if (!uniqueLocations[location][interval]) {
                uniqueLocations[location][interval] = 1;
            } else {
                uniqueLocations[location][interval]++;
            }
        });

        const responseObj = {
            totalComplaints: totalComplaints,
            complaintsByType: complaintsByType,
            uniqueLocations: uniqueLocations
        };

        log("", "Success", "complaint-controller/complaintsPeriod", "Buscar por data e cidade");
        return response.status(200).send(responseObj);

    } catch (e) {
        log("", "Error", "complaint-controller/complaintsPeriod", "Buscar por data e cidade: " + e);
        return response.status(500).send({ message: 'Falha ao processar sua requisição' });
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

        if (!data || data.length === 0) {
            return response.status(404).send({ message: 'Nenhum dado encontrado' });
        }

        const responseData = {};

        data.forEach(alert => {
            const { latitude, longitude, date, hour } = alert;
            const key = `${latitude},${longitude}`;

            if (!responseData[key]) {
                responseData[key] = {
                    location: {
                        latitude: latitude,
                        longitude: longitude
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
        });

        const locations = Object.values(responseData);

        log("", "Success", "alerts-controller/alertsCity", "Dados de alerta por cidade recuperados com sucesso");
        return response.status(200).send(locations);
    } catch (e) {
        log("", "Error", "alerts-controller/alertsCity", "Erro ao processar dados de alerta por cidade: " + e);
        return response.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
};


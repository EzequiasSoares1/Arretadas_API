const daysOfWeek = require('./treat-services/day');
const weeks = require('./treat-services/week');
const month = require('./treat-services/month');
const district = require('./treat-services/district');
const complaint = require('./treat-services/complaint')
const percents = require('./treat-services/percents');
const byLocalization = require('../services/geocoding-service');
const users = require('../repositories/user-repository');

function treatment(data) {
    let before = new Date(data.init);
    let after = new Date(data.final);
    let day = 86400000
    let result = (after - before) / day;

    let resultTreatment = {};
    let contOfTypes = 0;
    if (data.typeComplaint != undefined) {
        const { typesComplaint, contador } = complaint.returnCountOfTypes(data.data, data.typeComplaint)
        resultTreatment['Type'] = typesComplaint;
        contOfTypes = contador;
    }
    resultTreatment['District'] = district.returnDistricts(data.data);
    if (result <= 7) {
        resultTreatment['Date'] = daysOfWeek.returnInDay(data.data)
    } else if (result <= 28) {
        resultTreatment['Date'] = weeks.returnInWeek(data.data);
    } else if (result >= 29) {
        resultTreatment['Date'] = month.returnInMonth(data.data);
    }

    return percents.returnInPercents(resultTreatment, data.data.length, contOfTypes);
}

async function summaryComplaint(data) {
    const amountByType = {};
    data.forEach(complaint => {
        complaint.type_complaint.forEach(type => {
            if (amountByType[type]) {
                amountByType[type]++;
            } else {
                amountByType[type] = 1;
            }
        });
    });

    const amountComplaintsByCity = data.length;

    const locationsAndTimesMap = {};
    data.forEach(complaint => {
        const locationKey = `${complaint.latitude},${complaint.longitude}`;
        if (!locationsAndTimesMap[locationKey]) {
            locationsAndTimesMap[locationKey] = { times: [complaint.hour], dates: [complaint.date], occurrences: 1, types: complaint.type_complaint };
        } else {
            locationsAndTimesMap[locationKey].times.push(complaint.hour);
            locationsAndTimesMap[locationKey].dates.push(complaint.date);
            locationsAndTimesMap[locationKey].occurrences++;
            locationsAndTimesMap[locationKey].types.push(...complaint.type_complaint);
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
            occurrences: data.occurrences,
            types: Array.from(new Set(data.types))
        };
    }));

    const summary = {
        amountComplaintsByCity,
        complaintsByType: amountByType,
        locationsAndTimes
    };
    return summary;
}

async function summaryAlerts(data) {
    const amountAlertByCity = data.length;
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

    return resume;
}



module.exports = {
    treatment,
    summaryComplaint,
    summaryAlerts
}
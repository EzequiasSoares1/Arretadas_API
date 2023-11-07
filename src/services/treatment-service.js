const daysOfWeek = require('./treat-services/day');
const weeks = require('./treat-services/week');
const month = require('./treat-services/month');
const district = require('./treat-services/district');
const complaint = require('./treat-services/complaint')
const percents = require('./treat-services/percents')

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
    //return resultTreatment
}

module.exports = {
    treatment
}
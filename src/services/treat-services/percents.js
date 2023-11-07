async function returnInPercents(data, qtd, contOfTypes) {

    let objects = ["Type", "District", "Date"]

    contOfTypes != 0 ?
        await calcPercents(data[objects[0]], contOfTypes) :
        0;

    for (let index = 1; index < objects.length; index++) {
        await calcPercents(data[objects[index]], qtd);

    }
    return data;

}

function calcPercents(data, qtd) {
    for (let property in data) {
        data[property] = parseFloat(((data[property] * 100) / qtd).toFixed(2));
    }
}
module.exports = { returnInPercents };
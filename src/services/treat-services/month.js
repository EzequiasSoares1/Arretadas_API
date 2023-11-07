function returnInMonth(data){
    let monthsOfYear = [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro'
    ]
    let months = {};

    data.forEach((element) =>{

        if (!months.hasOwnProperty(monthsOfYear[element.date.getMonth()])) {
            months[monthsOfYear[element.date.getMonth()]] = 1;
        }else{
            months[monthsOfYear[element.date.getMonth()]] += 1;

        }
    });
    return months;
}

module.exports={returnInMonth};
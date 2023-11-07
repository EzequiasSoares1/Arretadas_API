function returnInWeek(data){
    let date;
    let weeks={
        'Semana 1':0,
        'Semana 2':0,
        'Semana 3':0,
        'Semana 4':0
    }
    data.forEach((element)=>{
        element.date.getDate()
        element.date.getMonth();
        element.date.getFullYear();
        if(date === undefined){
            date = element.date;
            weeks['Semana 1'] +=1;
        }else{
            let day = 86400000
            let result = (element.date - date) / day;
            if(result <=7){
                weeks['Semana 1'] +=1;
            }else if(result <= 14){
                weeks['Semana 2'] +=1;
            }else if(result <= 21){
                weeks['Semana 3'] +=1;
            }else if(result <=28){
                weeks['Semana 4'] +=1;
            }
        }

    });
    return weeks;

}

module.exports={returnInWeek};
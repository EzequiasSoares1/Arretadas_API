function returnInDay(data){
    
    let days = {};
    let dayOfMonth;
    data.forEach((element) =>{
        let day   =  element.date.getDate() +1;
        let month =  element.date.getMonth() +1;

        dayOfMonth = day < 10? "0"+ day: day;
        dayOfMonth += month < 10? "/0"+month:"/"+month;


        if (!days.hasOwnProperty(dayOfMonth)) {
            days[dayOfMonth] = 1;
        }else{
            days[dayOfMonth] += 1;
            
        }
    });
    return days;
}

module.exports={
    returnInDay
}
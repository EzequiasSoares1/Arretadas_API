function returnDistricts(data){
    let districts = {};

    data.forEach((element) => {
        if (!districts.hasOwnProperty(element.district)) {
            districts[element.district] = 1;

        }else{
            districts[element.district] += 1;
        }
      });
    
    
    return districts;
}

module.exports={returnDistricts};
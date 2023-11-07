var typesComplaint;
var contador;
function returnCountOfTypes(data, types){
    contador =0;
    typesComplaint ={}
    data.forEach((complaint) =>{
        
        complaint.type_complaint.forEach((type)=>{
            if(types[0]=='all'){
                returnFilter(type)
            }else{
                let indexOfType=types.indexOf(type);
                if(indexOfType!== -1){
                    returnFilter(types[indexOfType])

                }
            }
            
        })
        
    });


    return {typesComplaint, contador};

}

function returnFilter(type){
    if (!typesComplaint.hasOwnProperty(type)) {  
        typesComplaint[type] = 1;
    }else{
        typesComplaint[type] += 1;
        
        
    }
    contador++;
}
module.exports={returnCountOfTypes};
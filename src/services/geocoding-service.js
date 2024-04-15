const axios = require('axios');
const apiKey = 'AIzaSyDjT1BN6duxK1yipIExfujl3WAjMe-6D90';

module.exports = async function buscarLocalizaçãp(latitude, longitude) {
    try {
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&location_type=ROOFTOP&result_type=street_address&key=${apiKey}&result_type=locality&language=pt-BR`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (data.status === 'OK') {
            const Rua = data.results[0].address_components.find(component => component.types.includes('route')).long_name;
            const Bairro = data.results[0].address_components.find(component => component.types.includes('sublocality')).long_name;
            return { Rua, Bairro };
        } else {
            throw new Error('Geocoding API request failed');
        }
    } catch (error) {
        throw new Error(`Error getting locality: ${error.message}`);
    }
}


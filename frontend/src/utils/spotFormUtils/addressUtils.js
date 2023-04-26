export const getLatLngFromAddress = (address) => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`)
        .then((response) => {
            return response.json();
        }).then(jsonData => {
            console.log(jsonData.results[0].geometry.location); // {lat: 45.425152, lng: -75.6998028}
        })
        .catch(error => {
            console.log(error);
        })
}

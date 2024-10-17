var myMap = L.map('map', {
    center: [38.5, -97],
    zoom: 5
});

var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(myMap);

// Getting our GeoJSON data
d3.json("DataSets/model_county.geojson").then(function(data) {
        L.geoJson(data, {
            onEachFeature: function(feature, layer) {
                let tempchg = feature.properties.tempchg ? feature.properties.tempchg.toFixed(2) : null;
                // console.log(feature.properties.tempchg);
                layer.bindPopup(`<h3>${feature.properties.NAME}</h3><hr><p>Temperature Change: ${tempchg}F<br> (years: 1895 to 2019)</p>`);
            }
    }).addTo(myMap);

});

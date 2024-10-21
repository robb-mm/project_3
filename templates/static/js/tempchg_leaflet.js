var myMap = L.map('map', {
    center: [39.5, -97],
    zoom: 5
});

var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(myMap);

// Getting our GeoJSON data
d3.json("datasets/model_county.geojson").then(function(data) {
    fetch('datasets/model_state.csv').then(response => response.text()).then(csv => {
        Papa.parse(csv, {
            complete: function(results) {
                let csvdata = results.data;
                var st_list={};
                // console.log(csvdata[28][8]);
                for (let i=0; i<csvdata.length; i++)
                    st_list[csvdata[i][0]] = csvdata[i][8];
                // console.log(st_list["01"]);
    
                L.geoJson(data, {
                    onEachFeature: function(feature, layer) {
                        let tempchg = feature.properties.tempchg ? feature.properties.tempchg.toFixed(2) : null;
                        // let state = get_state(st_list, feature.properties.STATEFP);
                        let state = st_list[feature.properties.STATEFP]; // ? st_list[feature.properties.STATEFP][8] : null;
                        // console.log(st_list[feature.properties.STATEFP]);
                        layer.bindPopup(`<h3>${feature.properties.NAME}, ${state}</h3><hr><p>Temperature Change: ${tempchg}F<br> (year 1895 to 2019)</p>`);
                    }
                }).addTo(myMap);
            }
        });
    });
});

// Load and add the second GeoJSON layer
d3.json('datasets/us-states.geojson').then(function(data) {
    var geojsonLayer2 = L.geoJson(data, {style: style}).addTo(myMap);
});

function style(feature) {
    return {
        // fillColor: getColor(feature.properties.density),
        weight: 5,
        opacity: 1,
        color: 'red',
        // dashArray: '3',
        fillOpacity: 0
    };
}

function get_state(st_list, statefp) {
    for (let i=0; i<st_list.length; i++) {
        // console.log(st_list);
        if (st_list[i][0].toString() == statefp.toString()) {
            // console.log(st_list[i][8]);
            return st_list[i][8];
        }
    }

    return null;
    // console.log(state);
}
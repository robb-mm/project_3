var geojsonLayer1, geojsonLayer2;

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
    
                geojsonLayer1 = L.geoJson(data, {
                    style: county_style,
                    onEachFeature: function(feature, layer) {
                        let tempchg = feature.properties.tempchg ? feature.properties.tempchg.toFixed(2) : null;
                        let tempchg_c = feature.properties.tempchg_c ? feature.properties.tempchg_c.toFixed(2) : null;
                        // let state = get_state(st_list, feature.properties.STATEFP);
                        let state = st_list[feature.properties.STATEFP]; // ? st_list[feature.properties.STATEFP][8] : null;
                        // console.log(st_list[feature.properties.STATEFP]);
                        layer.bindPopup(`<h3>${feature.properties.NAME}, ${state}</h3><hr><p>Temperature Change<br>${tempchg} F (${tempchg_c} C)<br><br> year: 1895-2019</p>`);
                    }
                }).addTo(myMap);
            }
        });
    });
});

// Load and add the second GeoJSON layer
d3.json('datasets/us-states.geojson').then(function(data) {
    geojsonLayer2 = L.geoJson(data, {
                            style: states_style,
                            onEachFeature: function(feature, layer) {
                                layer.on({
                                    // mouseover: highlightFeature,
                                    // mouseout: resetHighlight
                                });
                            }
                        }).addTo(myMap);
});

function states_style(feature) {
    return {
        weight: 5,
        opacity: 1,
        color: 'blue',
        fillOpacity: 0
    };
}

function county_style(feature) {
    return {
        fillColor: getColor(feature.properties.tempchg),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function getColor(d) {
    return d > 2.5 ? '#800026' :
           d > 2.0  ? '#BD0026' :
           d > 1.5  ? '#E31A1C' :
           d > 1.0  ? '#FC4E2A' :
           d > 0.5   ? '#FD8D3C' :
           d > 0.0   ? '#FEB24C' :
           d > -0.5   ? '#FED976' :
                      '#FFEDA0';
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 4,
        color: 'red',
        dashArray: '',
        fillOpacity: 0
    });

    layer.bringToFront();
}

function resetHighlight(e) {
    geojsonLayer1.resetStyle(e.target);
    console.log("resetHighlight");
}

// var info = L.control();

// info.onAdd = function (myMap) {
//     this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
//     this.update();
//     return this._div;
// };

// // method that we will use to update the control based on feature properties passed
// info.update = function (props) {
//     this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
//         '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
//         : 'Hover over a state');
// };

// info.addTo(myMap);

// Create a legend to display information about our map.
let legend = L.control({position: 'bottomright'});

// When the layer control is added, insert a div with the class of "legend".
legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-0.5, 0.0, 0.5, 1.0, 1.5, 2.0, 2.5];

    div.innerHTML += '<b>Color Map (F)<b><br>'
        // loop through our temperature intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 0.1) + '"></i> ' +
            grades[i].toFixed(1) + ((grades[i + 1]!=null) ? ' &ndash; ' + grades[i + 1].toFixed(1) + '<br>' : '+');
    }

    return div;
};
// Add the info legend to the map.
legend.addTo(myMap);

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
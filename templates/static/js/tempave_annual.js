let st_list={};
// function init() {
    fetch('datasets/climdiv_state_year.csv').then(response => response.text()).then(csv => {
        Papa.parse(csv, {
            complete: function(results) {
                let csvdata = results.data;
                var year_list=[], temp_list=[];
                // console.log(csvdata[28][8]);
                for (let i=0; i<csvdata.length; i++) {
                    if (year_list[0]) {
                        year_list.push(csvdata[i][1]);
                        temp_list.push(csvdata[i][2]);
                    } else {
                        year_list[0] = csvdata[i][1];
                        temp_list[0] = csvdata[i][2];
                    }
                    
                    if ((i+1 == csvdata.length) || (csvdata[i][0] != csvdata[i+1][0])) {
                        st_list[csvdata[i][0]] = {"year": year_list, "temp": temp_list};
                        year_list=[], temp_list=[];
                    }
                }

                // Use d3 to select the dropdown with id of `#selDataset`
                let id_droplist = d3.select("#selDataset");
                
                // Populate the droplist
                for (var key in state_fips)
                    id_droplist.append("option").text(key);
            }
        });
    });
// }

let id_droplist = d3.select("#selCountyset");
id_droplist.length = 0;

function buildLineChart(state_name) {
    let fips = state_fips[state_name];
    // console.log(`${state_name} fips: ${fips}`);
    let temps = st_list[fips].temp.slice(0, 10);
    // Create the trace for the line chart
    var trace = {
        x: st_list[fips].year, //["1895", "1896", "1897", "1898", "1899", "1900", "1901", "1902", "1903", "1904"],
        y: st_list[fips].temp, //[61.64, 64.27, 64.19, 62.98, 63.1, 63.41, 61.39, 63.58, 61.97, 62.7],  //
        mode: 'lines+markers',
        type: 'scatter',
        line: {color: 'blue'}
    };
    // console.log(trace.y);
    var layout = {
        title: 'Average Temperature Per Year',
        xaxis: { title: 'Year' },
        yaxis: { title: 'Average Temperature (Fahrenheit)' }
    };

    // Render the plot
    Plotly.newPlot('chart', [trace], layout);

    let id_droplist = d3.select("#selCountyset");
    id_droplist.html("<option> </option>");

    // id_droplist.append("option").text("a");
    // console.log(id_droplist.options.length);
    
    // while (id_droplist.options.length > 0) {
    //     id_droplist.remove(0);
    // }
    
    for (let cty_key in county_fips[state_name]) {
        id_droplist.append("option").text(cty_key);
    };
}

function buildCountyLineChart(county_name) {
    let id_droplist = document.getElementById("selDataset");
    let state_name = id_droplist.options[id_droplist.selectedIndex].text;
    console.log(county_fips[state_name]);
}

// Function for event listener
function optionChanged(state_name) {
  // Build line chart each time a state is selected
  // console.log(` S T A R T _________${event.currentTarget.value}`)
  buildLineChart(event.currentTarget.value);
  // console.log(" E N D   _________")
}

function countyoptionChanged(county_name) {
    buildCountyLineChart(event.currentTarget.value);

    console.log(event.currentTarget.value);
}

// Initialize the dashboard
// init();

// Call optionChanged() when a change takes place to the DOM
d3.select("#selDataset").on("change", optionChanged);
d3.select("#selCountyset").on("change", countyoptionChanged);

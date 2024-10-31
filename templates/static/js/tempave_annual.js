let st_list={}, cty_list={};
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

    fetch('datasets/climdiv_county_year.csv').then(response => response.text()).then(csv => {
        Papa.parse(csv, {
            complete: function(results) {
                let csvdata = results.data;
                let year_list=[], temp_list=[];
                // console.log(csvdata);
                for (let i=0; i<csvdata.length; i++) {
                    if (year_list[0]) {
                        year_list.push(csvdata[i][1]);
                        temp_list.push(csvdata[i][2]);
                    } else {
                        year_list[0] = csvdata[i][1];
                        temp_list[0] = csvdata[i][2];
                    }
                    
                    if ((i+1 == csvdata.length) || (csvdata[i][0] != csvdata[i+1][0])) {
                        cty_list[csvdata[i][0]] = {"year": year_list, "temp": temp_list};
                        year_list=[], temp_list=[];
                    }
                }
            }
        });
    });
// }

function buildLineChart(state_name) {
    let fips = state_fips[state_name];

    // Create the trace for the line chart
    var trace = {
        x: st_list[fips].year,
        y: st_list[fips].temp,
        mode: 'lines+markers',
        type: 'scatter',
        line: {color: 'blue'}
    };

    var layout = {
        title: `Average Temperature Per Year<br>(${state_name})`,
        xaxis: { title: 'Year' },
        yaxis: { title: 'Average Temperature (Fahrenheit)' }
    };

    // Render the plot
    Plotly.newPlot('chart', [trace], layout);

    let id_droplist = d3.select("#selCountyset");
    id_droplist.html("<option> </option>");

    for (let cty_key in county_fips[state_name]) {
        id_droplist.append("option").text(cty_key);
    };
}

function buildCountyLineChart(county_name) {
    let id_droplist = document.getElementById("selDataset");
    let state_name = id_droplist.options[id_droplist.selectedIndex].text;
    // console.log(cty_list[county_fips[state_name][county_name]].temp);
    console.log(county_fips[state_name][county_name]);

    // Create the trace for the line chart
    var trace = {
        x: cty_list[county_fips[state_name][county_name]].year,
        y: cty_list[county_fips[state_name][county_name]].temp,
        mode: 'lines+markers',
        type: 'scatter',
        line: {color: 'blue'}
    };
    // console.log(trace.y);
    var layout = {
        title: `Average Temperature Per Year<br>(${county_name.split(" ")[0]}, ${state_name})`,
        xaxis: { title: 'Year' },
        yaxis: { title: 'Average Temperature (Fahrenheit)' }
    };

    // Render the plot
    Plotly.newPlot('chart', [trace], layout);
}

// Function for event listener
function optionChanged(state_name) {
  // Build line chart each time a state is selected
  buildLineChart(state_name);
}

function countyoptionChanged(county_name) {
    console.log(county_name);
    
    buildCountyLineChart(county_name);
}

// Initialize the dashboard
// init();

// Call optionChanged() when a change takes place to the DOM
// d3.select("#selDataset").on("change", optionChanged);
// d3.select("#selCountyset").on("change", countyoptionChanged);

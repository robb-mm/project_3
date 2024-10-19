function init() {
        fetch('datasets/climdiv_state_year.csv').then(response => response.text()).then(csv => {
            Papa.parse(csv, {
                complete: function(results) {
                    let csvdata = results.data;
                    var st_list={}, year_list=[], temp_list=[];
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
                    console.log(state_fips);
                    // Use d3 to select the dropdown with id of `#selDataset`
                    let id_droplist = d3.select("#selDataset");
                    
                    // Populate the droplist
                    const keys = Object.keys(state_fips);
                    keys.forEach(key => {
                        id_droplist.append("option").text(key);
                    });

                    
                }
            });
        });
}

function buildLineChart(state_name) {
    console.log(state_name);
}

// Function for event listener
function optionChanged(state_name) {
  // Build line chart each time a state is selected
  buildLineChart(state_name);
}

// Initialize the dashboard
init();

// Call optionChanged() when a change takes place to the DOM
d3.select("#selDataset").on("change", optionChanged);

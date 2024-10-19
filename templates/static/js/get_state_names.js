var state_names={}, state_fips={};

fetch('datasets/model_state.csv').then(response => response.text()).then(csv => {
    Papa.parse(csv, {
        complete: function(results) {
            let csvdata = results.data;
            // console.log(csvdata[28][8]);
            for (let i=0; i<csvdata.length; i++) {
                // Object.assign(state_names, {"fips":csvdata[i][0], "state_name":csvdata[i][8]})
                state_names[csvdata[i][0]] = csvdata[i][8];
                state_fips[csvdata[i][8]] = csvdata[i][0];
            }
            // console.log(state_names["01"]);

        }
    });
});

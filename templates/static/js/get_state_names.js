var state_names={}, state_fips={};

fetch('datasets/model_state.csv').then(response => response.text()).then(csv => {
    Papa.parse(csv, {
        header: true,
        complete: function(results) {
            let csvdata = results.data;
            console.log(csvdata);
            for (let i=0; i<csvdata.length; i++) {
                // Object.assign(state_names, {"fips":csvdata[i][0], "state_name":csvdata[i][8]})
                state_fips[csvdata[i].STATE_NAME] = csvdata[i].fips;
                console.log(csvdata[i].STATE_NAME);
            }
            // console.log(state_fips["Alabama"]);

        }
    });
});

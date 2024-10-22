let county_names={}, county_fips={}, temp_dict={};

fetch('datasets/model_county.csv').then(response => response.text()).then(csv => {
    Papa.parse(csv, {
        complete: function(results) {
            let csvdata = results.data;
            // console.log(csvdata[28][8]);
            for (let i=0; i<csvdata.length; i++) {
                // let key = csvdata[i][8] + ", " + csvdata[i][7];
                // console.log(key);
                // county_names[csvdata[i][0]] = csvdata[i][8];

                temp_dict[csvdata[i][7]] = csvdata[i][0];

                if ((i+1 == csvdata.length) || (csvdata[i][8] != csvdata[i+1][8])) {
                    county_fips[csvdata[i][8]] = temp_dict;
                    temp_dict = {};
                }
            }
            console.log(county_fips);

        }
    });
});
// {"Alabama": {"Autauga": 01001, "Baldwin": 01003}}
// Variables to store full data for future filtering
let fullData = [];
let fullLabels = [];

// Fetch the CSV file and process data
fetch('datasets/model_county.csv')
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n').slice(1); // Skip the header row
        const states = new Set(); // Use Set to collect unique state names
        const labels = []; // For storing county names and states
        const annualData = []; // For storing annual temperature changes
        const fallData = []; // For storing Fall temperature changes
        const springData = []; // For storing Spring temperature changes
        const summerData = []; // For storing Summer temperature changes
        const winterData = []; // For storing Winter temperature changes

        // Process each row in the CSV
        rows.forEach(row => {
            const columns = row.split(',');
            if (columns.length > 1) { // Ensure the row is not empty
                const state = columns[8]; // State name (STNAME)
                const county = columns[7]; // County name (CTYNAME)
                states.add(state); // Add state to Set (to get unique values)
                labels.push({ county: county, state: state }); // Store county and state name
                annualData.push(parseFloat(columns[6])); // Store annual temperature change
                fallData.push(parseFloat(columns[1])); // Store Fall temperature change
                springData.push(parseFloat(columns[2])); // Store Spring temperature change
                summerData.push(parseFloat(columns[3])); // Store Summer temperature change
                winterData.push(parseFloat(columns[4])); // Store Winter temperature change
            }
        });

        // Store full data for filtering later
        fullData = { annual: annualData, fall: fallData, spring: springData, summer: summerData, winter: winterData };
        fullLabels = labels;

        // Populate the state dropdown with unique states
        const stateSelect = document.getElementById('state-select');
        states.forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateSelect.appendChild(option);
        });

        // Add event listener for when a state is selected
        stateSelect.addEventListener('change', function() {
            const selectedState = this.value;
            const countySelect = document.getElementById('county-select');

            // Reset the county dropdown and disable it if no state is selected
            countySelect.innerHTML = '<option value="">--Select a County--</option>';
            countySelect.disabled = selectedState === "";

            if (selectedState) {
                // Populate the county dropdown based on the selected state
                const filteredCounties = fullLabels.filter(label => label.state === selectedState);
                filteredCounties.forEach(label => {
                    const option = document.createElement('option');
                    option.value = label.county;
                    option.textContent = label.county;
                    countySelect.appendChild(option);
                });
            }
        });

        // Add event listener for when a county is selected
        const countySelect = document.getElementById('county-select');
        countySelect.addEventListener('change', function() {
            const selectedCounty = this.value;
            const selectedState = stateSelect.value;

            if (selectedCounty && selectedState) {
                // Filter the data for the selected state and county
                filterDataByStateAndCounty(selectedState, selectedCounty);
            }
        });
    });

// Function to update the chart with new data
function updateChart(labels, datasets) {
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    if (window.myChart) {
        window.myChart.destroy(); // Destroy previous chart instance to avoid overlapping
    }
    window.myChart = new Chart(ctx, {
        type: 'bar', // Bar chart type
        data: {
            labels: labels, // County name (x-axis)
            datasets: datasets // Multiple datasets (for each season and annual)
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true // Start y-axis at 0
                }
            },
            responsive: true,
            maintainAspectRatio: false // Make chart responsive
        }
    });
}

// Function to filter data by the selected state and county
function filterDataByStateAndCounty(state, county) {
    const filteredLabels = [];
    const filteredAnnual = [];
    const filteredFall = [];
    const filteredSpring = [];
    const filteredSummer = [];
    const filteredWinter = [];
    
    fullLabels.forEach((label, index) => {
        if (label.state === state && label.county === county) {
            filteredLabels.push(label.county);
            filteredAnnual.push(fullData.annual[index]);
            filteredFall.push(fullData.fall[index]);
            filteredSpring.push(fullData.spring[index]);
            filteredSummer.push(fullData.summer[index]);
            filteredWinter.push(fullData.winter[index]);
        }
    });

    // Update chart with filtered data for the selected county
    updateChart(filteredLabels, [
        {
            label: 'Annual Temperature Change',
            data: filteredAnnual,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        },
        {
            label: 'Fall Temperature Change',
            data: filteredFall,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        },
        {
            label: 'Spring Temperature Change',
            data: filteredSpring,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        },
        {
            label: 'Summer Temperature Change',
            data: filteredSummer,
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1
        },
        {
            label: 'Winter Temperature Change',
            data: filteredWinter,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
        }
    ]);
}


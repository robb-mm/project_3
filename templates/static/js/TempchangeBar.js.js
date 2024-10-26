let myChart;
let countyData = [];

// Load CSV file and initialize dropdowns
fetch('datasets/model_county.csv') // Replace with actual path to your CSV file
    .then(response => response.text())
    .then(csvData => {
        Papa.parse(csvData, {
            header: true,
            complete: function(results) {
                countyData = results.data;
                populateStateDropdown();
            }
        });
    });

function populateStateDropdown() {
    const stateSelect = document.getElementById("stateSelect");
    const states = [...new Set(countyData.map(item => item.STNAME))]; // Get unique state names

    states.forEach(state => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    });
}

function updateCountyDropdown() {
    const stateSelect = document.getElementById("stateSelect");
    const countySelect = document.getElementById("countySelect");
    const selectedState = stateSelect.value;

    countySelect.innerHTML = '<option value="">Select County</option>'; // Reset county dropdown

    const counties = countyData.filter(item => item.STNAME === selectedState).map(item => item.CTYNAME);
    counties.forEach(county => {
        const option = document.createElement("option");
        option.value = county;
        option.textContent = county;
        countySelect.appendChild(option);
    });
}

function updateChart() {
    const countySelect = document.getElementById("countySelect");
    const selectedCounty = countySelect.value;

    const selectedData = countyData.find(item => item.CTYNAME === selectedCounty);
    if (!selectedData) return;

    const chartData = {
        labels: ['Spring', 'Summer', 'Fall', 'Winter'],
        datasets: [{
            label: `Temperature Change for ${selectedCounty}`,
            data: [selectedData.Spring, selectedData.Summer, selectedData.Fall, selectedData.Winter].map(Number),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)', 
                'rgba(54, 162, 235, 0.2)', 
                'rgba(255, 206, 86, 0.2)', 
                'rgba(75, 192, 192, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)', 
                'rgba(54, 162, 235, 1)', 
                'rgba(255, 206, 86, 1)', 
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 2,
            hoverBackgroundColor: 'rgba(0, 0, 0, 0.1)',
            hoverBorderColor: 'rgba(0, 0, 0, 1)',
            // Dataset-specific animation
            animation: {
                duration: 3000, // Longer duration for this dataset
                easing: 'easeInOutExpo' // Different easing effect for this dataset
            }
        }]
    };
    
    const chartOptions = {
        plugins: {
            title: {
                display: true,
                text: `Seasonal Temperature Data for ${selectedCounty}`,
                font: {
                    size: 18,
                    family: 'Arial'
                },
                padding: {
                    top: 10,
                    bottom: 20
                },
                color: '#333'
            },
            legend: {
                display: true,
                labels: {
                    color: '#333',
                    font: {
                        size: 14,
                        family: 'Arial'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderWidth: 1,
                borderColor: '#ccc'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#333',
                    font: {
                        size: 12
                    }
                },
                grid: {
                    color: 'rgba(200, 200, 200, 0.3)'
                }
            },
            x: {
                ticks: {
                    color: '#333',
                    font: {
                        size: 12
                    }
                },
                grid: {
                    display: false
                }
            }
        }
    };

    if (myChart) {
        myChart.destroy(); // Destroy old chart if it exists
    }

    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
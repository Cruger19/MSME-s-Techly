// Line Graph
const lineCtx = document.getElementById('lineGraph').getContext('2d');
const { JSDOM } = require('jsdom');
const { window } = new JSDOM(`<!DOCTYPE html><body><canvas id="lineGraph"></canvas></body>`);
const { document } = window;
const lineGraph = new Chart(lineCtx, {
    type: 'line',
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [{
            label: 'Sales',
            data: [120, 190, 300, 500, 200, 300],
            borderColor: '#4CAF50',
            borderWidth: 2,
            fill: false
        }]
    },
    options: {
        responsive: true,
        plugins: {
            tooltip: {
                enabled: true
            }
        },
        scales: {
            x: {
                beginAtZero: true
            },
            y: {
                beginAtZero: true
            }
        }
    }
});

// Pie Chart
const pieCtx = document.getElementById('pieChart').getContext('2d');
const pieChart = new Chart(pieCtx, {
    type: 'pie',
    data: {
        labels: ['Green', 'Yellow', 'Red'],
        datasets: [{
            data: [40, 35, 25],
            backgroundColor: ['#4CAF50', '#FFD700', '#FF4500']
        }]
    },
    options: {
        responsive: true,
        plugins: {
            tooltip: {
                enabled: true
            }
        }
    }
});

// Bar Graph
const barCtx = document.getElementById('barGraph').getContext('2d');
const barGraph = new Chart(barCtx, {
    type: 'bar',
    data: {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        datasets: [{
            label: 'Visitors',
            data: [50, 70, 40, 90, 60],
            backgroundColor: '#4CAF50',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            tooltip: {
                enabled: true
            }
        },
        scales: {
            x: {
                beginAtZero: true
            },
            y: {
                beginAtZero: true
            }
        }
    }
});

// Create the bar chart for user input data
const userInputCtx = document.getElementById("myChart").getContext("2d");
const chart = new Chart(userInputCtx, {
    type: 'bar',
    data: {
        labels: ["Category 1", "Category 2", "Category 3"],
        datasets: [{
            label: 'Dataset 1',
            data: [10, 20, 30],
            backgroundColor: '#4CAF50',
            borderColor: '#388E3C',
            borderWidth: 1,
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        },
        interaction: {
            mode: 'index',
            intersect: false
        }
    }
});

// Function to add data to the chart (for user input)
function addData() {
    const label = document.getElementById("labelInput").value;
    const value = document.getElementById("valueInput").value;

    if (label && value) {
        // Add new label and value to chart data
        chart.data.labels.push(label);
        chart.data.datasets[0].data.push(Number(value));

        // Update the chart with new data
        chart.update();

        // Clear input fields
        document.getElementById("labelInput").value = '';
        document.getElementById("valueInput").value = '';
    } else {
        alert("Please enter both label and value!");
    }
}
document.addEventListener("DOMContentLoaded", function() {
    console.log("JavaScript is working!");

    // Example: Update revenue dynamically
    const revenue = document.getElementById("revenue");
    revenue.textContent = "$20,000";

    // Example: Chart.js (if you're using it for the sales chart)
    const ctx = document.getElementById('salesChart').getContext('2d');
    const salesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May'],
            datasets: [{
                label: 'Sales',
                data: [1000, 2000, 3000, 4000, 5000],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        }
    });
});

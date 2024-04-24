document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('myChart')) return;

    const ctx = document.getElementById('myChart').getContext('2d');

    let gradientFill = ctx.createLinearGradient(0, 0, 0, ctx.canvas.clientHeight);
    gradientFill.addColorStop(0, 'rgba(43, 54, 116, 0.5)');

    Chart.defaults.plugins.tooltip.backgroundColor = '#FFFFFF';
    Chart.defaults.plugins.tooltip.titleColor = '#FFFFFF';
    Chart.defaults.plugins.tooltip.bodyColor = '#2B3674';
    Chart.defaults.plugins.tooltip.bodyFont = { size: 16 };
    Chart.defaults.plugins.tooltip.bodyAlign = 'center';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(0, 0, 0, 0.25)';
    Chart.defaults.plugins.tooltip.boxShadow = '0px 4px 4px rgba(0, 0, 0, 0.25)';
    Chart.defaults.plugins.tooltip.usePointStyle = true;
    Chart.defaults.plugins.tooltip.caretSize = 0; // Remove the caret
    Chart.defaults.plugins.tooltip.caretPadding = 16;

    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Churn Rate',
                data: [3.2, 4.5, 3.9, 4.89, 5.62, 4.89],
                backgroundColor: gradientFill,
                borderColor: '#2B3674',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#8950FC',
                pointBorderColor: '#FFFFFF',
                pointBorderWidth: 2,
                pointRadius: 7.5,
                pointHoverRadius: 7.5,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    display: false,
                    beginAtZero: false
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#727693',
                        font: {
                            size: 16,
                            weight: 500
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    displayColors: false,
                    backgroundColor: '#FFFFFF',
                    bodyFontColor: '#2B3674',
                    bodyFont: {
                        size: 16
                    },
                    padding: 8,
                    bodyAlign: 'center',
                    borderColor: 'rgba(0, 0, 0, 0.25)',
                    borderWidth: 1,
                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                    borderRadius: 20,
                    callbacks: {
                        title: function() {
                            return '';
                        },
                        label: function(context) {
                            let label = context.parsed.y || 0;
                            return label + '%';
                        },
                        labelTextColor: function() {
                            return '#000000';
                        }
                    }
                }
            },
            elements: {
                point: {
                    radius: 7.5,
                    backgroundColor: '#8950FC',
                    borderColor: '#FFFFFF',
                    borderWidth: 2,
                    hoverRadius: 7.5,
                    hoverBorderWidth: 2
                },
                line: {
                    tension: 0.5
                }
            },
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
});
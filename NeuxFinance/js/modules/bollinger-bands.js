async function getData() {
    try {
        const response = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=1000');
        const data = await response.json();
        displayData(data);
    } catch (error) {
        console.error('API isteği başarısız:', error);
    }
}

function displayData(data) {
    const closePrices = data.map(candle => parseFloat(candle[4]));

    const times = data.map(candle => new Date(candle[0]).toLocaleDateString());

    
    const period = 20;
    const stdDev = 2;
    const bollingerBands = calculateBollingerBands(closePrices, period, stdDev);

    const ctx = document.getElementById('priceChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: times,
            datasets: [{
                label: 'Price',
                data: closePrices,
                borderColor: 'white',
                fill: false,
                pointRadius: 0
            },
            {
                label: 'Upper Bollinger Band',
                data: bollingerBands.upper,
                borderColor: 'green',
                fill: false,
                pointRadius: 0,
                borderDash: [1, 1]
            },
            {
                label: 'Lower Bollinger Band',
                data: bollingerBands.lower,
                borderColor: 'red',
                fill: false,
                pointRadius: 0,
                borderDash: [1, 1]
            }]
        },
        options: {
            plugins: {
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'x'
                    },
                    pan: {
                        enabled: true,
                        mode: 'x'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        display: false
                    },
                },
                y: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'darkgray'
                    },
                    beginAtZero: false
                }
            }
        }
    });

    chart.canvas.parentNode.style.width = '1200px';
    chart.canvas.parentNode.style.height = '600px';
    chart.canvas.parentNode.style.overflow = 'hidden';
    chart.canvas.style.width = '1200px';
    chart.canvas.style.height = '600px';
}

function calculateBollingerBands(closePrices, period, stdDev) {
    const bands = {
        upper: [],
        middle: [],
        lower: []
    };

    for (let i = 0; i < closePrices.length; i++) {
        if (i < period - 1) {
            bands.upper.push(null);
            bands.middle.push(null);
            bands.lower.push(null);
            continue;
        }

        const slice = closePrices.slice(i - period + 1, i + 1);
        const avg = slice.reduce((acc, val) => acc + val, 0) / period;
        const stdDeviation = Math.sqrt(slice.reduce((acc, val) => acc + (val - avg) ** 2, 0) / period);

        bands.middle.push(avg);
        bands.upper.push(avg + stdDeviation * stdDev);
        bands.lower.push(avg - stdDeviation * stdDev);
    }

    return bands;
}

getData();
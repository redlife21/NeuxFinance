async function getData() {
    try {
        const response = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=1000');
        const data = await response.json();
        displayData(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayData(data) {
    const closePrices = data.map(candle => parseFloat(candle[4]));

    const times = data.map(candle => new Date(candle[0]).toLocaleDateString());

    const period = 14; 
    const rsiValues = calculateRSI(closePrices, period);

    const ctx = document.getElementById('priceChart').getContext('2d');
    const priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: times,
            datasets: [{
                label: 'Price',
                data: closePrices,
                borderColor: 'white',
                fill: false,
                pointRadius: 0
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

    priceChart.canvas.parentNode.style.width = '1300px';
    priceChart.canvas.parentNode.style.height = '800px';
    priceChart.canvas.parentNode.style.overflow = 'hidden';
    priceChart.canvas.style.width = '1300px';
    priceChart.canvas.style.height = '800px';

    const rsiCtx = document.getElementById('rsiChart').getContext('2d');
    const rsiChart = new Chart(rsiCtx, {
        type: 'line',
        data: {
            labels: times,
            datasets: [{
                label: 'RSI',
                data: rsiValues,
                borderColor: 'orange',
                fill: false,
                pointRadius: 0
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
                        color: 'darkgray',
                        display: false
                    },
                    beginAtZero: false
                }
            }
        }
    });
    rsiChart.canvas.parentNode.style.width = '1300px';
    rsiChart.canvas.parentNode.style.height = '800px';
    rsiChart.canvas.parentNode.style.overflow = 'hidden';
    rsiChart.canvas.style.width = '1300px';
    rsiChart.canvas.style.height = '800px';
}

function calculateRSI(closePrices, period) {
    const rsiValues = [];

    for (let i = 0; i < closePrices.length; i++) {
        if (i < period) {
            rsiValues.push(null);
            continue;
        }

        let sumGain = 0;
        let sumLoss = 0;

        for (let j = i - period + 1; j <= i; j++) {
            const priceDiff = closePrices[j] - closePrices[j - 1];
            if (priceDiff > 0) {
                sumGain += priceDiff;
            } else {
                sumLoss -= priceDiff;
            }
        }

        const avgGain = sumGain / period;
        const avgLoss = sumLoss / period;

        const rs = avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));

        rsiValues.push(rsi);
    }

    return rsiValues;
}

getData();
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
    const closePrices = data.map(candle => candle[4]);
    const times = data.map(candle => new Date(candle[0]).toLocaleDateString());

    
    const sma200 = calculateSMA(closePrices, 200);
    const sma50 = calculateSMA(closePrices, 50);


    const crossPoints = findCrossPoints(sma200, sma50);

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
            }, {
                label: '200 SMA',
                data: sma200,
                borderColor: 'red',
                fill: false,
                pointRadius: 0
            }, {
                label: '50 SMA',
                data: sma50,
                borderColor: 'green',
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
        },
        plugins: [{
            afterDraw: function(chart) {
                const ctx = chart.ctx;
                const yAxis = chart.scales['y'];
                const xAxis = chart.scales['x'];
                const crossColor = 'yellow';

                for (const crossPoint of crossPoints) {
                    const x = xAxis.getPixelForValue(crossPoint.time);
                    const yTop = yAxis.getPixelForValue(yAxis.max);
                    const yBottom = yAxis.getPixelForValue(yAxis.min);

                    ctx.save();
                    ctx.strokeStyle = crossColor;
                    ctx.beginPath();
                    ctx.moveTo(x, yTop);
                    ctx.lineTo(x, yBottom);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }]
    });

    chart.canvas.parentNode.style.width = '1200px';
    chart.canvas.parentNode.style.height = '600px';
    chart.canvas.parentNode.style.overflow = 'hidden';
    chart.canvas.style.width = '1200px';
    chart.canvas.style.height = '600px';
}

function calculateSMA(data, period) {
    const smaArray = [];
    for (let i = 0; i < data.length; i++) {
        if (i >= period - 1) {
            let sum = 0;
            for (let j = 0; j < period; j++) {
                sum += parseFloat(data[i - j]);
            }
            smaArray.push(sum / period);
        } else {
            smaArray.push(null);
        }
    }
    return smaArray;
}

function findCrossPoints(sma200, sma50) {
    const crossPoints = [];
    for (let i = 1; i < sma200.length; i++) {
        if (sma200[i - 1] < sma50[i - 1] && sma200[i] >= sma50[i]) {
            crossPoints.push({ time: i });
        } else if (sma200[i - 1] > sma50[i - 1] && sma200[i] <= sma50[i]) {
            crossPoints.push({ time: i });
        }
    }
    return crossPoints;
}

getData();
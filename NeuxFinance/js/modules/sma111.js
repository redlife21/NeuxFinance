async function getData() {
    try {
        const response = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=1000');
        const data = await response.json();
        displayData(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

function calculateSMA(data) {
    const sma = [];
    for (let i = 111 - 1; i < data.length; i++) {
        let sum = 0;
        for (let j = i; j > i - 111; j--) {
            sum += parseFloat(data[j][4]);
        }
        sma.push(sum / 111);
    }
    console.log(sma);   
    return sma;
}

function displayData(data) {
    const closePrices = data.map(candle => candle[4]);
    const times = data.map(candle => new Date(candle[0]).toLocaleDateString());

    const smaPeriod = 111;
    const smaValues = calculateSMA(data);

    const ctx = document.getElementById('priceChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: times.slice(smaPeriod - 1),
            datasets: [{
                label: 'Price',
                data: closePrices.slice(smaPeriod - 1),
                borderColor: 'white',
                fill: false,
                pointRadius: 0
            },
            {
                label: '111 SMA',
                data: smaValues,
                borderColor: 'red',
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
                        color: 'lightgray'
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

getData();
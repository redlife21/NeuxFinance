async function getBinancePrice(symbol) {
    const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
    const data = await response.json();
    return parseFloat(data.price).toFixed(2);
}

async function displayPrices() {
    try {
        const bitcoinPrice = await getBinancePrice("BTCUSDT");
        const ethereumPrice = await getBinancePrice("ETHUSDT");
        const bnbPrice = await getBinancePrice("BNBUSDT");

        document.getElementById("bitcoinPrice").textContent = bitcoinPrice;
        document.getElementById("ethereumPrice").textContent = ethereumPrice;
        document.getElementById("bnbPrice").textContent = bnbPrice;
    } catch (error) {
        console.error('Hata oluştu:', error);
    }
}

displayPrices();
setInterval(displayPrices, 5000);
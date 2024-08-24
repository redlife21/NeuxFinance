const exchangeInfoUrl = 'https://api.binance.com/api/v3/exchangeInfo';

      document.addEventListener('DOMContentLoaded', async () => {
          await populateCurrencyOptions();
      });

      async function populateCurrencyOptions() {
          try {
              const response = await fetch(exchangeInfoUrl);
              const data = await response.json();

              const symbols = data.symbols;

              const fromCurrencySelect = document.getElementById('fromCurrency');
              const toCurrencySelect = document.getElementById('toCurrency');

              const usdtPairs = {};

              symbols.forEach(symbol => {
                  if (symbol.quoteAsset === 'USDT') {
                      usdtPairs[symbol.baseAsset] = true;
                  }
              });

              Object.keys(usdtPairs).forEach(pair => {
                  const option1 = document.createElement('option');
                  option1.value = pair;
                  option1.textContent = pair;
                  fromCurrencySelect.appendChild(option1);

                  const option2 = document.createElement('option');
                  option2.value = pair;
                  option2.textContent = pair;
                  toCurrencySelect.appendChild(option2);
              });
          } catch (error) {
              console.error('Hata:', error);
          }
      }

      async function convert() {
          const amount = parseFloat(document.getElementById('amount').value);
          const fromCurrency = document.getElementById('fromCurrency').value;
          const toCurrency = document.getElementById('toCurrency').value;

          try {
              const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
              const result = amount * exchangeRate;

              document.getElementById('amount2').value = result.toFixed(2);
          } catch (error) {
              console.error('Error:', error);
          }
      }

      async function getExchangeRate(fromCurrency, toCurrency) {
          const first = await getBinancePrice(`${fromCurrency}USDT`);
          const second = await getBinancePrice(`${toCurrency}USDT`);
          return first / second;
      }

      async function getBinancePrice(symbol) {
          const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
          const data = await response.json();
          return parseFloat(data.price);
      }
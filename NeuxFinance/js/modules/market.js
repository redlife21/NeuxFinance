let sortOrder = 1;
      
function removeTrailingZeros(num) {
  return num.includes('.') ? num.replace(/\.?0*$/, '') : num;
}

function redirectToBinance(symbol) {
  window.location.href = 'https://www.binance.com/tr/trade/' + symbol;
}

function getPairs() {
  fetch('https://api.binance.com/api/v3/ticker/24hr')
    .then(response => response.json())
    .then(data => {
      const pairList = document.getElementById('pair-list');
      data.filter(pair => pair.symbol.endsWith('USDT') && (parseFloat(pair.lastPrice) !== 0 && parseFloat(pair.volume) !== 0)).forEach(pair => {
        const row = pairList.insertRow();
        row.insertCell(0).textContent = pair.symbol;
        row.insertCell(1).textContent = removeTrailingZeros(pair.lastPrice) + " USDT";
        row.insertCell(2).textContent = removeTrailingZeros(pair.volume);
        const priceChangePercentCell = row.insertCell(3);
        priceChangePercentCell.textContent = pair.priceChangePercent + "%";
        if (parseFloat(pair.priceChangePercent) < 0) {
          priceChangePercentCell.classList.add('red');
        } else if (parseFloat(pair.priceChangePercent) > 0) {
          priceChangePercentCell.classList.add('green');
        }
        row.addEventListener('click', () => redirectToBinance(pair.symbol));
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function sortTable(colIndex) {
  const table = document.getElementById('pair-table');
  const tbody = table.getElementsByTagName('tbody')[0];
  const rows = Array.from(tbody.getElementsByTagName('tr'));

  rows.sort((a, b) => {
    const aValue = a.cells[colIndex].textContent;
    const bValue = b.cells[colIndex].textContent;
    if (colIndex === 0) {
      return sortOrder * aValue.localeCompare(bValue);
    } else {
      return sortOrder * (parseFloat(aValue) - parseFloat(bValue));
    }
  });

  tbody.innerHTML = '';
  rows.forEach(row => {
    tbody.appendChild(row);
  });

  sortOrder *= -1;
}

document.addEventListener('DOMContentLoaded', getPairs);
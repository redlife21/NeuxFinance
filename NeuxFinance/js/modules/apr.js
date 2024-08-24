function calculateDailyReturn() {
    var principal = parseFloat(document.getElementById('principal').value);
    var interestRate = parseFloat(document.getElementById('interestRate').value);

    if (isNaN(principal) || isNaN(interestRate)) {
        alert('Invalid input.');
        return;
    }

    var dailyRate = Math.pow(1 + (interestRate / 100), 1/365) - 1;
    var dailyReturn = principal * dailyRate;

    document.getElementById('result').innerHTML = 'Daily Reward: ' + dailyReturn.toFixed(2) + ' dollar';
}
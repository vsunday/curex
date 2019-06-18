const express = require('express');
const fetch = require('node-fetch');

const PORT = process.env.PORT || '8081';
const app = express();

function getExchangeRate(req, resp) {
  const from = req.query.from || 'USD';
  const to = req.query.to || 'JPY';
  
  const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${process.env.API_KEY}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const content = data['Realtime Currency Exchange Rate'];
      resp.json({
        from: content['1. From_Currency Code'],
        to: content['3. To_Currency Code'],
        rate: content['5. Exchange Rate'],
        time: content['6. Last Refreshed'],
        timezone: content['7. Time Zone']
      });
    })
    .catch(err => console.error(err));
}

app.get('/rate', getExchangeRate);
app.use(express.static('build'));

app.listen(PORT, () => console.log(`listening on ${PORT}`));
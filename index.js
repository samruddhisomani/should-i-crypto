const Endpoints = {
  CoinGecko: 'https://api.coingecko.com/api/v3',
  ExchangeRates: 'https://api.exchangeratesapi.io'
}

const CoinGecko = {
  fetchMarketChart: async (coinId, currency, params = {}) => {
    if (params['from'] == undefined) {
      params.from = moment().subtract(7, 'days').startOf('day').unix();
    }

    if (params['to'] == undefined) {
      params.to = moment().startOf('day').unix();
    }

    let path = `${Endpoints.CoinGecko}/coins/${coinId}/market_chart/range`;
    let parameters = `?vs_currency=${currency}&from=${params.from}&to=${params.to}`;
    return await axios.get(path + parameters).then((json) => json.data);
  },
  symbol: async (coinId) => {
    let path = `${Endpoints.CoinGecko}/coins/${coinId}`;
    return await axios.get(path).then(json => json.data.symbol.toUpperCase())
  }
}

const ExchangeRates = {
  history: async (params = {}) => {
    if (params['start_at'] == undefined) {
      params.start_at = moment().subtract(7, 'days').format('YYYY-MM-DD');
    }

    if (params['end_at'] == undefined) {
      params.end_at = moment().format('YYYY-MM-DD');
    }

    let path = `${Endpoints.ExchangeRates}/history`;
    let parameters = `?start_at=${params.start_at}&end_at=${params.end_at}`;
    return await axios.get(path + parameters).then((json) => json.data);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#inputForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const cryptoInput = document.querySelector('#cryptoSelect');
    const fiatInput = document.querySelector('#fiatSelect');
    const ctx = document.querySelector("#lineGraph");
    const crypto = await CoinGecko.fetchMarketChart(cryptoInput.value, fiatInput.value.toLowerCase());
    const fiat = await ExchangeRates.history();

    var cryptoParsed = crypto.prices.map((i) => {
      return {
        x: i[0],
        y: i[1]
      };
    });

    var fiatParsed = Object.keys(fiat.rates).map((i) => {
      let data = fiat.rates[i];
      return {
        x: moment(i).valueOf(),
        y: data[fiatInput.value]
      }
    });

    new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: await CoinGecko.symbol(cryptoInput.value),
          borderColor: 'rgb(255, 99, 132)',
          data: cryptoParsed,
        }, {
          label: fiatInput.value,
          borderColor: 'rgb(54, 162, 235)',
          data: fiatParsed,
        }
        ]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Exchange Rates (Log Scale)'
        },
        layout: {
          padding: {
            left: 50,
            right: 50,
            top: 50,
            bottom: 50
          }
        },
        scales: {
          yAxes: [{
            type: 'logarithmic'
          }],
          xAxes: [{
            type: 'time',
            time: {
              unit: 'day'
            }
          }]
        }
      }
    });
  });
});
const ShouldICrypto = {
  getCrypto: function (coin) {
    const baseUrl = 'https://api.coingecko.com/api/v3/';
    const path = 'coins/' + coin + '/market_chart/range';
    const from = moment().subtract(7, 'days').unix();
    const to = moment().unix();
    const params = '?vs_currency=gbp&from=' + from + '&to=' + to;
    return axios.get(baseUrl + path + params);
  },
  getFiat: function (currency) {
    const baseUrl = 'https://api.exchangeratesapi.io/';
    const path = 'history';
    const startAt = moment().subtract(7, 'days').format('YYYY-MM-DD');
    const endAt = moment().format('YYYY-MM-DD');
    const params = '?base=GBP' + '&start_at=' + startAt + '&end_at=' + endAt + "&symbols=" + currency;
    return axios.get(baseUrl + path + params);
  },
  getData: function (coin, currency) {
    return axios.all([this.getCrypto(coin), this.getFiat(currency)]);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  ShouldICrypto.getData('bitcoin', 'USD').then(function (response) {
    let crypto = response[0].data.prices;
    let fiat = response[1].data.rates;
    let cryptoParsed = crypto.map(function (a) {
      return {
        x: a[0],
        y: a[1]
      };
    });
    let fiatParsed = Object.keys(fiat).map(function (b) {
      return {
        x: moment(b).unix(),
        y: fiat[b].USD
      }
    })

    console.log(cryptoParsed);
    console.log(fiatParsed);

    let graph = document.querySelector('#lineGraph');
    var chart = new Chart(graph, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Crypto',
          borderColor: 'rgb(255, 99, 132)',
          data: cryptoParsed
        }, {
          label: 'Fiat',
          borderColor: 'rgb(54, 162, 235)',
          data: fiatParsed
        }
        ]
      },
      options: {
        responsive: true
      }
    })
  })
})